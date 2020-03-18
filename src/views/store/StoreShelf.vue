<template>
  <div class="store-shelf">
    <shelf-title></shelf-title>
    <Scroll class="store-shelf-scroll-wrapper" 
            :top="0"
            @onScroll="onScroll">
      <shelf-search></shelf-search>
      <shelf-list></shelf-list>
    </Scroll>
  </div>
</template>

<script>
import ShelfTitle from '../../components/shelf/ShelfTitle.vue'
import ShelfSearch from '../../components/shelf/shelfSearch.vue'
import Scroll from '../../components/common/Scroll.vue'
import { shelf } from '../../api/store.js'
import { storeShelfMixin } from '../../utils/mixin.js'
import ShelfList from '../../components/shelf/ShelfList.vue'
import { appendAddToShelf } from '../../utils/store.js'
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfTitle,
    Scroll,
    ShelfSearch,
    ShelfList
  },
  methods: {
    getShelfList () {
      shelf().then(res => {
        if (res.status === 200 && res.data && res.data.bookList){
          console.log(res.data.bookList)
          this.setShelfList(appendAddToShelf(res.data.bookList))
        }
      })
    },
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
    }
  },
  mounted () {
    this.getShelfList()
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
