<template>
  <div>
    <div class="search-bar" 
       :class="{'hide-title': !titleVisible, 'hide-shadow': !shadowVisible}">
      <transition name="title-move">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
        <div class="title-icon-text-wrapper">
          <span class="title-text title">{{$t('home.title')}}</span> 
        </div>
        <div class="title-icon-shake-wrapper">
          <span class="icon-shake icon" @click="showFlapCard"></span> 
        </div>
        </div>
      </transition>

      <div class="title-icon-back-wrapper" 
           :class="{'hide-title': !titleVisible}"
           @click="back">
        <span class="icon-back icon" ></span> 
      </div>

      <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input type="text"
                 class="input"
                 :placeholder="$t('home.hint')"
                 v-model="searchText"
                 @click="showHotSearch"
                 @keyup.13.exact="search">
        </div>
      </div>
    </div>
    <hot-search-list v-show="hotSearchVisible" ref="hotSearch"></hot-search-list>
  </div>

</template>

<script>
import { storeHomeMixin } from '../../utils/mixin.js'
import HotSearchList from '../../components/home/HotSearchList.vue'
export default {
  mixins: [storeHomeMixin],
  components: {
    HotSearchList
  },
  data () {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  watch: {
    // 控制搜索框的显示
    offsetY (offsetY) {
      if (offsetY > 0){
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    hotSearchOffsetY (offsetY) {
      if (offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
    }
  },
  methods: {
    search () {
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    showFlapCard () {
      this.setFlapCardVisible(true)
    },
    back () {
      if (this.offsetY > 0) {
        this.showShadow()
      } else {
        this.hideShadow()
      }
      if (this.hotSearchVisible) {
        this.hideHotSearch()
      } else {
        this.$router.push({
          path: '/store/shelf'
        })
      }
    },
    hideHotSearch () {
      this.hotSearchVisible = false
      if (this.offsetY > 0) {
        this.hideTitle()
        this.showShadow()
      } else {
        this.showTitle()
        this.hideShadow()
      }
    },
    showHotSearch () {
      this.hotSearchVisible = true
      this.hideTitle()
      this.hideShadow()
      this.$nextTick(() => {
        this.$refs.hotSearch.reset()
      })
    },
    hideTitle () {
      this.titleVisible = false
    },
    showTitle () {
      this.titleVisible = true
    },
    hideShadow () {
      this.shadowVisible = false
    },
    showShadow () {
      this.shadowVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.search-bar{
  position: relative;
  width: 100%;
  z-index:150;
  height: px2rem(94);
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
  &.hide-title{
    height: px2rem(52)
  }
  &.hide-shadow{
    box-shadow: none;
  }
  .search-bar-title-wrapper{
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(42);
    .title-icon-text-wrapper{
      text-align: center;
      width: 100%;
      height: px2rem(42);
    }
    .title-icon-shake-wrapper{
      position: absolute;
      right: px2rem(15);
      top: 0;
      height: px2rem(42);
      @include center;
    }
  }
   .title-icon-back-wrapper{
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: px2rem(42);
      @include center;
      transition: height $animationTime $animationType;
      z-index: 200;
      &.hide-title{
        height: px2rem(52);
        transition: height .2s linear;
      }
   }
  .search-bar-input-wrapper{
    width: 100%;
    height: px2rem(52);
    padding: px2rem(10);
    box-sizing: border-box;
    position: absolute;
    display: flex;
    top: px2rem(42);
    transition: top $animationTime $animationType;
    &.hide-title{
      top: 0;
      transition: top $animationTime $animationType;
    }
    .search-bar-blank{
      flex: 0 0 0;
      width: 0;
      transition: all $animationTime $animationType;
      &.hide-title{
      flex: 0 0 px2rem(31);
      width: px2rem(31);
      }
    }
    .search-bar-input{
     flex: 1;
     background-color: #f4f4f4;
     border-radius: px2rem(20);
     padding: px2rem(5) px2rem(15);
     box-sizing: border-box;
     border: px2rem(1) solid #eee;
     @include left;
     .icon-search{
      color: #999;
     }
     .input{
      width: 100%;
      height: px2rem(22);
      border: none;
      background: transparent;
      margin-left: px2rem(10);
      font-size: px2rem(12);
      color: #666 ;
      &:focus{
        outline: none;
      }
      &::-webkit-input-placeholder{
        color: #ccc;
      }
     }
    }

  }
}
</style>
