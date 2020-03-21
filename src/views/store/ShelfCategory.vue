<template>
  <div class="store-shelf">
    <shelf-title :title="shelfCategory.title"></shelf-title>
    <Scroll class="store-shelf-scroll-wrapper" 
            :top="0"
            :bottom="srollBottom"
            @onScroll="onScroll"
            ref="scroll"
            v-if="shelfCategory.itemList && shelfCategory.itemList.length > 0">
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
      <shelf-foot></shelf-foot>
    </Scroll>
    <div class="store-shelf-empty-view" v-else>
        {{$t('shelf.groupNone')}}
    </div>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/ShelfTitle.vue'
import Scroll from '../../components/common/Scroll.vue'
import { storeShelfMixin } from '../../utils/mixin.js'
import ShelfList from '../../components/shelf/ShelfList.vue'
import ShelfFoot from '../../components/shelf/ShelfFoot.vue'

export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
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
    // 获取分类列表数据
    this.getCategoryList(this.$route.query.title)
    this.setCurrentType(2)
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
 .store-shelf-empty-view {
   position: absolute;
   top: 0;
   left: 0;
   width: 100%;
   height: 100%;
   font-size: px2rem(14);
   color: #333;
   @include center;
 }
}
</style>
