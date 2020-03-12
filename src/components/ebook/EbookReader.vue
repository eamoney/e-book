<template>
<div class="ebook-reader">
  <div id="read">
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import { ebookMixin } from '../../utils/mixin.js'
import Epub from 'epubjs'
import { flatten } from '../../utils/book.js'
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
      touchStartTime: 0
    }
  },
  components: {
  },
  methods: {
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
          console.log(url)
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
    initEpub () {
      // 根据fileName获取相应的url地址
      const url = `${process.env.VUE_APP_RES_URL}/epub/` + this.fileName + '.epub'
      this.book = new Epub(url)
      console.log(url, this.book)
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
    },
    nextPage () {
      if (this.rendition){
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
      }
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
    const fileName = this.$route.params.fileName.split('|').join('/')
    this.setFileName(fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
 .ebook-reader{
 }
</style>
