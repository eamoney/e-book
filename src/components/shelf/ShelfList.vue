<template>
  <div class="shelf-list" :style="{top: shelfListTop}">
    <transition-group name="list" 
                      tag="div" 
                      id="shelf-list">
    <div class="shelf-list-item-wrapper"
         v-for="item in data"
         :key="item.id">
         <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
         <div class="shelf-list-title-wrapper">
             <span class="shelf-list-title title-small">{{item.title}}</span>
         </div>
    </div>
    </transition-group>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
import { realPx, px2rem } from '../../utils/utils'
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
    },
    shelfListTop () {
      return px2rem(this.top) + 'rem'
    }
  },
  props: {
    top: {
      type: Number,
      default () {
        return 94
      }
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  }
}
</script>

<style lang="scss" scpoed rel="stylesheet/scss">
@import "../../assets/styles/global";
.shelf-list{
  position: absolute;
  left: 0;
  z-index: 100;
  width: 100%;
  #shelf-list{
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
      &.list-leave-active{
        display: none;
      }
      &.list-move{
        transition: transform .5s;
      }
    }
    .shelf-list-title-wrapper{
      margin-top: px2rem(10);
    }
  }
}
</style>
