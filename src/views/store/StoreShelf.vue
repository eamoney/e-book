<template>
  <div class="store-shelf">
    <shelf-title :title="$t('shelf.title')"></shelf-title>
    <Scroll class="store-shelf-scroll-wrapper" 
            :top="0"
            :bottom="srollBottom"
            @onScroll="onScroll"
            ref="scroll">
      <shelf-search></shelf-search>
      <shelf-list :data="shelfList"></shelf-list>
    </Scroll>
    <shelf-foot></shelf-foot>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/ShelfTitle.vue'
import ShelfSearch from '../../components/shelf/shelfSearch.vue'
import Scroll from '../../components/common/Scroll.vue'
import { storeShelfMixin } from '../../utils/mixin.js'
import ShelfList from '../../components/shelf/ShelfList.vue'
import ShelfFoot from '../../components/shelf/ShelfFoot.vue'

export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList,
    ShelfFoot
  },
  watch: {
    isEditMode (v) {
      this.srollBottom = v ? 48 : 0
      // 需要等所有dom响应完成之后调用 否则会不生效 
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  },
  data () {
    return {
      srollBottom: 0
    }
  },
  methods: {
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
    }
  },
  mounted () {
    this.getShelfList()
    this.setShelfCategory([])
    this.setCurrentType(1)
  }
}
</script>

<style lang="scss" scoped>
 @import "../../assets/styles/global";
.store-shelf{
 position: relative;
 z-index:100;
 background: white;
 width: 100%;
 height: 100%;
 .store-shelf-scroll-wrapper {
   position: absolute;
   top: 0;
   left: 0;
   z-index: 101;
   width: 100%;
   height: 100%;
 }
}
</style>
