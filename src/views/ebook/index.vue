<template>
  <div class="ebook" ref="ebook">
   <ebook-header/>
   <ebook-title/>
   <ebook-reader/>
   <ebook-menu/>
   <ebook-bookmark/>
   <ebook-footer/>
  </div>
</template>

<script>
import EbookReader from '../../components/ebook/EbookReader.vue'
import EbookTitle from '../../components/ebook/EbookTitle.vue'
import EbookMenu from '../../components/ebook/EbookMenu.vue'
import EbookBookmark from '../../components/ebook/EbookBookmark'
import { ebookMixin } from '../../utils/mixin.js'
import { getReadTime, saveReadTime } from '../../utils/localStorage.js'
import EbookHeader from '../../components/ebook/EbookHeader.vue'
import EbookFooter from '../../components/ebook/EbookFooter.vue'

export default {
  name: 'ebook',
  data () {
    return {
      task: null
    }
  },
  mixins: [ebookMixin],
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookmark,
    EbookHeader,
    EbookFooter
  },
  watch: {
    offsetY (v) {
      if (!this.menuVisible && this.bookAvailable) {
        if (v > 0) {
          this.move(v)
        } else if (v === 0){
          this.restore()
        }
      }
    }
  },
  methods: {
    move (v) {
      // 拖拽事件的实现原理
      this.$refs.ebook.style.top = v + 'px'
    },
    restore () {
      this.$refs.ebook.style.top = 0
      this.$refs.ebook.style.transition = 'all 0.2s linear'
      setTimeout(() => {
        // 需要清楚动画 否则下次下拉之前 transition存在会影响效果
        this.$refs.ebook.style.transition = ''
      }, 200)
    },
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  },
  mounted () {
    this.startLoopReadTime()
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
