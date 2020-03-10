<template>
  <transition name="popup-slide-up">
    <div class="ebook-popup-list" v-show="fontFamilyVisible">
      <div class="ebook-popup-title">
        <div class="ebook-popup-title-icon" @click="hide">
          <span class="icon-down2"></span>
        </div>
        <span class="ebook-popup-title-text">{{$t('book.selectFont')}}</span>
      </div>
      <div class="ebook-popup-list-wrapper">
        <div class="ebook-popup-item"
         v-for="(item,index) in fontFamilyList"
         :key="index"
         @click="setFontFamliy(item.font)">
          <div class="ebook-popup-item-text" :class="{selected:isSelected(item)}">
            {{item.font}}
          </div>
          <div class="ebook-popup-item-check" v-if="isSelected(item)">
            <span class="icon-check"></span>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script>
import { FONT_FAMILY } from '../../utils/book.js'
import { ebookMixin } from '../../utils/mixin.js'
import { saveFontFamily } from '../../utils/localStorage.js'
export default {
  mixins: [ebookMixin],
  data () {
    return {
      fontFamilyList: FONT_FAMILY
    }
  },
  methods: {
    hide () {
      this.setFontFamilyVisible(false)
    },
    isSelected (item) {
      return this.defaultFontFamily === item.font
    },
    setFontFamliy (font) {
      this.setDefaultFontFamily(font)
      saveFontFamily(this.fileName, font)
      if (font === 'Default'){
        this.currentBook.rendition.themes.font('Times New Roman')
      } else {
        this.currentBook.rendition.themes.font(font)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.ebook-popup-list{
  position: absolute;
  bottom: 0;
  left: 0;
  z-index:300;
  width: 100%;
  background-color: white;
  box-shadow: 0 px2rem(-4) px2rem(6) rgba(0,0,0, .1);
  .ebook-popup-title{
    position: relative;
    padding: px2rem(15);
    box-sizing: border-box;
    border-bottom: px2rem(1) solid #b8b9bb;
    text-align: center;
    @include center;
    .ebook-popup-title-icon{
      position: absolute;
      left:px2rem(15);
      height:100%;
      top:0;
      font-size: px2rem(16);
      font-weight: bold;
      @include center;
    }
    .ebook-popup-title-text{
      font-size: px2rem(14);
      font-weight: bold;
    }
  }
  .ebook-popup-list-wrapper{
    .ebook-popup-item{
      padding: px2rem(15);
      display: flex;
      .ebook-popup-item-text{
        flex:1;
        font-size: px2rem(14);
        text-align: left;
        &.selected{
          color: #346ce9;
        }
      }
      .ebook-popup-item-check{
        flex:1;
        text-align: right;
        font-size: px2rem(14);
        font-weight: bold;
        color: #346ce9;
      }
    }
  }
}
</style>
