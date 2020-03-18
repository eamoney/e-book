<template>
  <div class="shelf-item-book">
    <img class="shelf-item-book-cover"
         :src="data.cover">
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  }
}
</script>

<style lang="scss" scpoed>
@import "../../../assets/styles/global";
.shelf-item-book-cover{
  width: 100%;
  height: 100%;
}
</style>
