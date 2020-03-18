<template>
  <div class="shelf-list">
    <div class="shelf-list-item-wrapper"
         v-for="item in shelfList"
         :key="item.id">
         <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
         <div class="shelf-list-title-wrapper">
             <span class="shelf-list-title title-small">{{item.title}}</span>
         </div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
import { realPx } from '../../utils/utils'
import ShelfItem from './ShelfItem'
export default {
  mixins: [storeShelfMixin],
  components: {
    ShelfItem
  },
  computed: {
    // h = w / 250 * 350
    itemHeight () {
      return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
    }
  }
}
</script>

<style lang="scss" scpoed rel="stylesheet/scss">
@import "../../assets/styles/global";
.shelf-list{
  position: absolute;
  top: px2rem(94);
  left: 0;
  z-index: 100;
  display: flex;
  padding: 0 px2rem(15) !important;
  flex-flow: row wrap;
  width: 100%;
  box-sizing: border-box;
  .shelf-list-item-wrapper{
    box-sizing: border-box;
    padding: px2rem(15);
    flex: 0 0 33.33%;
    width: 33.33%;
  }
  .shelf-list-title-wrapper{
    margin-top: px2rem(10);
    .shelf-list-title{}
  }
}
</style>
