<template>
<div class="ebook-reader">
  <div id="read">
  </div>
</div>
</template>

<script>
// @ is an alias to /src
import { mapGetters } from 'vuex'
import Epub from 'epubjs'
global.epub = Epub
export default {
  name: 'EbookReader',
  data () {
    return {
      book: null,
      rendition: null,
      touchStartX: 0,
      touchStartTime: 0
    }
  },
  components: {
  },
  computed: {
    ...mapGetters(['fileName'])
  },
  methods: {
    initEpub () {
      // 根据fileName获取相应的url地址
      const url = 'http://127.0.0.1:8088/epub/' + this.fileName + '.epub'
      this.book = new Epub(url)
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
        } else if (time < 500 && offsetX < -40){
          this.nextPage()
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
    toggleTitleAndMenu () {}
  },
  mounted () {
    const fileName = this.$route.params.fileName.split('|').join('/')
    this.$store.dispatch('setFileName', fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>
