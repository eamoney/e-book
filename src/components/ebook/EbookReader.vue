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
      rendition: null
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
      const url = 'http://192.168.0.100:8088/epub/' + this.fileName + '.epub'
      this.book = new Epub(url)
      console.log(url, this.book)
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      })
      this.rendition.display()
    }
  },
  mounted () {
    const fileName = this.$route.params.fileName.split('|').join('/')
    this.$store.dispatch('setFileName', fileName).then(() => {
      this.initEpub()
    })
  }
}
</script>
