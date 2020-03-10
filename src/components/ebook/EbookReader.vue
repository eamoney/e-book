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
    initEpub () {
      // 根据fileName获取相应的url地址
      const url = 'http://127.0.0.1:8088/epub/' + this.fileName + '.epub'
      this.book = new Epub(url)
      this.setCurrentBook(this.book)
      console.log(url, this.book)
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      })
      this.rendition.display()
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
    prevPage () {
      if (this.rendition){
        this.rendition.prev()
      }
    },
    nextPage () {
      if (this.rendition){
        this.rendition.next()
      }
    },
    toggleTitleAndMenu () {
      if (this.menuVisible){
        this.setSettingVisible(-1)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    hideTitleMenu (){
      this.setMenuVisible(false)
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
