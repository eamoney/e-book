<template>
<div class="ebook-reader">
  <div id="read"></div>
  <div class="ebook-reader-mask"
       @click="onMaskClick"
       @touchmove="move"
       @touchend="movend"
       @mousedown.left="onMouseEnter"
       @mousemove.left="onMouseMove"
       @mouseup.left="onMouseEnd"></div>
</div>
</template>

<script>
// @ is an alias to /src
import { ebookMixin } from '../../utils/mixin.js'
import Epub from 'epubjs'
import { flatten } from '../../utils/book.js'
import { getLocalForage } from '../../utils/localForage.js'
import { 
  getFontFamily,
  saveFontFamily,
  getFontSize,
  saveFontSize,
  getTheme,
  saveTheme,
  getLocation
} from '../../utils/localStorage.js'
global.epub = Epub
export default {
  name: 'EbookReader',
  mixins: [ebookMixin],
  data () {
    return {
      rendition: null,
      touchStartX: 0,
      touchStartTime: 0,
      firstOffsetY: null
    }
  },
  components: {
  },
  methods: {
    /** 解决pc端触摸时的兼容性问题 */
    onMouseEnter (e) {
      this.mouseState = 1
      this.mouseStartTime = e.timeStamp
    },
    onMouseMove (e) {
      if (this.mouseState === 1) {
        this.mouseState = 2
      } else if (this.mouseState === 2) {
        let offsetY = 0
        if (this.firstOffsetY) {
          offsetY = e.clientY - this.firstOffsetY
          this.setOffsetY(offsetY)
        } else {
          this.firstOffsetY = e.clientY
        }
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMouseEnd (e) {
      if (this.mouseState === 2) {
        this.setOffsetY(0)
        this.firstOffsetY = null
        this.mouseState = 3
      } else {
        this.mouseState = 4
      }
      const time = e.timeStamp - this.mouseStartTime
      if (time < 200){
        this.mouseState = 4
      }
      e.preventDefault()
      e.stopPropagation()
    },
    onMaskClick (e) {
      if (this.mouseState && this.mouseState === 2 && this.mouseState === 3) {
        return
      }
      const offsetX = e.offsetX
      const width = window.innerWidth
      if (offsetX > 0 && offsetX < width * 0.3) {
        this.prevPage()
      } else if (offsetX > 0 && offsetX > width * 0.7) {
        this.nextPage()
      } else {
        this.toggleTitleAndMenu()
      }
    },
    move (e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    movend (e) {
      this.setOffsetY(0)
      this.firstOffsetY = null
    },
    initTheme () {
      /** 注册主题样式 */
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      this.rendition.themes.select(defaultTheme)
    },
    initFontSize () {
      let fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    initFontFamily () {
      let font = getFontFamily(this.fileName)
      if (!font) {
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(font)
        this.setDefaultFontFamily(font)
      }
    },
    initRendition () {
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      })
      const location = getLocation(this.fileName)
      this.display(location, () => {
        this.initFontSize()
        this.initFontFamily()
        this.initTheme()
        this.initGlobalStyle()
      })
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        ]).then(() => {})
      })
    },
    initGesture () {
      this.rendition.on('touchstart', e => {
        this.touchStartX = e.changedTouches[0].clientX
        this.touchStartTime = e.timeStamp
      })
      this.rendition.on('touchend', e => {
        const offsetX = e.changedTouches[0].clientX - this.touchStartX
        const time = e.timeStamp - this.touchStartTime
        if (time < 500 && offsetX > 40){
          this.prevPage()
          this.hideTitleMenu()
        } else if (time < 500 && offsetX < -40){
          this.nextPage()
          this.toggleTitleAndMenu()
        } else {
          this.toggleTitleAndMenu()
        }
        e.preventDefault()
        e.stopPropagation()
      })
    },
    parseBook () {
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      this.book.loaded.metadata.then(metadata => {
        this.setMetadata(metadata)
      })
      this.book.loaded.navigation.then(nav => {
        const navItem = flatten(nav.toc)
        function find (item, level = 0) {
          return !item.parent ? level : find(navItem.filter(parentItem => 
            parentItem.id === item.parent)[0], ++level)
        }
        navItem.forEach(item => {
          item.level = find(item)
        })
        this.setNavigation(navItem)
      })  
    }, 
    initEpub (url) {
      // 根据fileName获取相应的url地址
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      this.initRendition()
      this.initGesture()
      this.parseBook()
      // ready是在book全部解析之后才会调用 分页算法
      this.book.ready.then(() => {
        return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
      }).then(location => {
        this.setBookAvailable(true)
        // 由于分页算法的缘故 可能没有分页完成 已经刷新 使得不到progess 所以在这再次调用progress
        this.refreshLocation()
      })
    },
    prevPage () {
      if (this.rendition){
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
      }
      this.hideTitleMenu()
    },
    nextPage () {
      if (this.rendition){
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
      }
      this.hideTitleMenu()
    },
    toggleTitleAndMenu () {
      if (this.menuVisible){
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    }
  },
  mounted () {
    const books = this.$route.params.fileName.split('|')
    const bookName = books[1]
    const fileName = books.join('/')
    getLocalForage(bookName, (err, blob) => {
      if (!err && blob) {
        this.setFileName(fileName).then(() => {
          this.initEpub(blob)
        })
      } else {
        this.setFileName(fileName).then(() => {
          const url = `${process.env.VUE_APP_EPUB_URL}/` + this.fileName + '.epub'
          this.initEpub(url)
        }) 
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
 .ebook-reader{
   width:100%;
   height:100%;
  .ebook-reader-mask{
    width:100%;
    height:100%;
    z-index: 150;
    position: absolute;
    background: transparent;
    top:0;
    left:0;
  }
 }
</style>
