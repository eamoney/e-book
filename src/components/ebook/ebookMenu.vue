<template>
  <div>
    <div class="menu-bar">
      <transition name="slide-up">
        <div class="menu-wrapper" v-show="menuVisible" :class="{'hide-box-shadow': !menuVisible || settingVisible >= 0}">
          <div class="icon-wrapper">
            <span class="icon-menu" @click="showSetting(3)"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-progress" @click="showSetting(2)"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-bright" @click="showSetting(1)"></span>
          </div>
          <div class="icon-wrapper">
            <span class="icon-a" @click="showSetting(0)">A</span>
          </div>
        </div>
      </transition>
    </div>
    <ebook-setting-font/>
    <ebook-setting-font-popup/>
    <ebook-setting-theme/>
    <ebook-setting-progress/>
    <ebook-slide/>
  </div>
</template>

<script>
import EbookSettingFontPopup from './EbookSettingFontPopup.vue'
import EbookSettingFont from './EbookSettingFone.vue'
import { ebookMixin } from '../../utils/mixin.js'
import EbookSettingTheme from '../../components/ebook/EbookSettingTheme.vue'
import EbookSettingProgress from '../../components/ebook/EbookSettingProgress.vue'
import EbookSlide from '../../components/ebook/EbookSlide/EbookSlide'
export default {
  mixins: [ebookMixin],
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme,
    EbookSettingProgress,
    EbookSlide
  },
  methods: {
    showSetting (key){
      this.setSettingVisible(key)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global.scss';
.menu-wrapper{
  &.hide-box-shadow{
    box-shadow: none;
  }
  z-index:101;
  position: absolute;
  bottom:0;
  left:0;
  width: 100%;
  height: px2rem(48);
  background-color: white;
  box-shadow: 0 px2rem(-8) px2rem(8) rgba(0,0,0, .15);
  display: flex;
  font-size: px2rem(20);
  .icon-wrapper{
    flex:1;
    @include center;
    .icon-progress{
      font-size: px2rem(28);
    }
    .icon-bright{
      font-size: px2rem(24);
    }
  }
}
</style>
