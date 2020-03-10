<template>
  <div class="ebook-popup-list" v-show="fontFamilyVisible">
    <div class="ebook-popup-title">
      <div class="ebook-popup-title-icon" @click="hide">
        <span class="icon-down2"></span>
      </div>
      <span class="ebook-popup-title-text">选择字体</span>
    </div>

    <div class="ebook-popup-title"></div>
  </div>
</template>

<script>
import { ebookMixin } from '../../utils/mixin.js'
export default {
  mixins: [ebookMixin],
  methods: {
    hide () {
      this.setFontFamilyVisible(true)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
