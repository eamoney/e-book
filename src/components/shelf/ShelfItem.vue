<template>
  <div class="shelf-item"
      :class="{'shelf-item-shadow': data.type ===1 || data.type === 2}"
      @click="onItemClick">
     <component :is="item" :data="data">
     </component>
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
      if (this.data.type === 1) {
        this.showBookDetail(this.data)
      } else if (this.data.type === 2) {

      } else {
        gotoStoreHome(this)
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
  &.shelf-item-shadow{
    box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
  }
}
</style>
