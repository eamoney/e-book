<template>
  <div class="self-search-wrapper" 
      :class="{'search-top': ifInputClick, 'hide-shaow':ifHideShadow }">
      <div class="self-search" :class="{'search-top': ifInputClick}">
          <div class="search-wrapper">
              <div class="icon-search-wrapper">
                  <span class="icon-search icon"></span>
              </div>
              <div class="search-input-wrapper">
                  <input type="text"
                         class="search-input"
                         @click="onSearchClick"
                         :placeholder="$t('shelf.search')"
                         v-model="searchText">
              </div>
              <div class="icon-clear-wrapper" 
                   v-if="searchText.length>0"
                   @click="clearSearchText">
                  <span class="icon-close-circle-fill"></span>
              </div>
          </div>
          <div class="icon-locale-wrapper" v-if="!ifInputClick" @click = "switchLocale">
              <span class="icon-cn icon" v-if="lang === 'cn'"></span>
              <span class="icon-en icon" v-if="lang === 'en'"></span>
          </div>
          <div class="cancel-btn-wrapper" @click="onCancelClick" v-else>
              <span class="cancel-text">{{$t('shelf.cancel')}}</span>
          </div>
      </div>
      <transition name="hot-search-move">
        <div class="self-search-tab-wrapper" v-if="ifInputClick">
           <div class="self-search-tab-item"
                v-for="(item, index) in tabs"
                :key="index"
                @click="onTabClick(item.id)">
                <span class="shelf-search-tab-text"
                     :class="{'isSelected': selectedTab === item.id}">
                    {{item.text}}
                </span>
          </div>
        </div>
      </transition>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin.js'
import { setLocalStorage } from '../../utils/localStorage.js'
export default {
  mixins: [storeShelfMixin],
  computed: {
    lang () {
      return this.$i18n.locale
    },
    tabs () {
      return [
        {
          id: 1,
          text: this.$t('shelf.default')
        },
        {
          id: 2,
          text: this.$t('shelf.progress')
        },
        {
          id: 3,
          text: this.$t('shelf.purchase')
        }
      ]
    }
  },
  data () {
    return {
      ifInputClick: false,
      searchText: '',
      selectedTab: 1,
      ifHideShadow: true
    }
  },
  methods: {
    onSearchClick () {
      this.ifInputClick = true
      this.setShelfTitleVisible(false)
    },
    onCancelClick () {
      this.ifInputClick = false
      this.setShelfTitleVisible(true)
    },
    switchLocale () {
      if (this.lang === 'en') {
        this.$i18n.locale = 'cn'
      } else {
        this.$i18n.locale = 'en'
      }
      setLocalStorage('locale', this.$i18n.locale)
    },
    clearSearchText () {
      this.searchText = ''
    },
    onTabClick (id) {
      this.selectedTab = id
    }
  },
  watch: {
    offsetY (v) {
      if (v > 0 && this.ifInputClick) {
        this.ifHideShadow = false
      } else {
        this.ifHideShadow = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.self-search-wrapper{
  position: relative;
  z-index: 105;
  width: 100%;
  height: px2rem(94);
  font-size: px2rem(16);
  background: white;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
  &.hide-shaow{
    box-shadow: none;
  }
  &.search-top{
    position: fixed;
    left: 0;
    top: 0;
  }
  .self-search {
    position: absolute;
    top: px2rem(42);
    left: 0;
    width: 100%;
    height: px2rem(52);
    z-index: 105;
    display: flex;
    transition: top $animationTime linear;
    &.search-top{
      top: 0;
    }
    .search-wrapper{
      flex: 1;
      display: flex;
      margin: px2rem(8) 0 px2rem(8) px2rem(10);
      border: px2rem(1) solid #ccc;
      border-radius: px2rem(3);
      .icon-search-wrapper{
        flex: 0 0 px2rem(22);
        @include right;
        .icon-search{
          font-size: px2rem(12);
        }
      }
      .search-input-wrapper{
        flex: 1;
        box-sizing: border-box;
        padding: 0 px2rem(10);
        @include center;
        .search-input{
          width: 100%;
          font-size: px2rem(14);
          border: none;
          color: #333;
          &:focus{
            outline: none;
          }
          &::-webkit-input-placeholder {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-clear-wrapper{
        flex: 0 0 px2rem(24);
        @include left;
        .icon-close-circle-fill{
          font-size: px2rem(14);
          color: #ccc;
        }
      }
    }
    .icon-locale-wrapper{
      flex: 0 0 px2rem(55);
      @include center;
      .icon-cn, .icon-en{
        font-size: px2rem(22);
        color: #666;
      }
    }
    .cancel-btn-wrapper{
      flex: 0 0 px2rem(55);
      @include center;
      .cancel-text{
        font-size: px2rem(14);
        color: $color-blue;
      }
    }
  }
  .self-search-tab-wrapper{
    position: absolute;
    top: px2rem(52);
    left: 0;
    z-index: 105;
    display: flex;
    width: 100%;
    height: px2rem(42);
    .self-search-tab-item{
      flex: 1;
      @include center;
      .shelf-search-tab-text{
        font-size: px2rem(12);
        color: #999;
        &.isSelected{
          color: $color-blue;
        }
      }
    }
  }
}
</style>
