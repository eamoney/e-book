<template>
  <div class="shelf-item"
      :class="{'shelf-item-shadow': data.type ===1 || data.type === 2}"
      @click="onItemClick">
     <component :is="item" :data="data"></component>
     <div class="icon-selected"
          :class="{'is-selected': data.selected}"
          v-show="isEditMode && data.type === 1"></div>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin'
import ShelfBook from './SheltItemComponents/ShelfItemBook'
import ShelfCategory from './SheltItemComponents/ShelfItemCategory'
import ShelfAdd from './SheltItemComponents/ShelfItemAdd'
import { gotoStoreHome } from '../../utils/store.js'
export default {
  mixins: [storeShelfMixin],
  computed: {
    item () {
      return this.data.type === 1 ? this.book 
        : (this.data.type === 2 ? this.category : this.add)
    }
  },
  data () {
    return {
      book: ShelfBook,
      category: ShelfCategory,
      add: ShelfAdd
    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    onItemClick () {
      if (this.isEditMode){
        if (this.data.type === 3) {
          return
        }
        this.data.selected = !this.data.selected
        if (this.data.selected) {
          this.shelfSelected.pushWithoutDuplicate(this.data)
        } else {
          this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
        }
      } else {
        if (this.data.type === 1) {
          this.showBookDetail(this.data)
        } else if (this.data.type === 2) {
          this.$router.push({
            path: '/store/category',
            query: {
              title: this.data.title
            }
          })
        } else {
          gotoStoreHome(this)
        }
      }
    }
  }
}
</script>

<style lang="scss" scpoed>
@import "../../assets/styles/global";
.shelf-item{
  width: 100%;
  height: 100%;
  position: relative;
  &.shelf-item-shadow{
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
  }
  .icon-selected{
    position: absolute;
    bottom: px2rem(2);
    right: px2rem(2);
    font-size: px2rem(18);
    color: rgba(0, 0, 0, .4);
    &.is-selected{
      color: $color-blue;
    }
  }
}
</style>
