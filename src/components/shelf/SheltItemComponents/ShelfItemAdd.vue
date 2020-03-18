<template>
  <div class="shelf-item-add">
    <div class="icon-add"></div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scpoed>
@import "../../../assets/styles/global";
.shelf-item-add{
  width: 100%;
  height: 100%;
  border: px2rem(1) solid #ccc;
  box-sizing: border-box;
  @include center;
  .icon-add{
    font-size: px2rem(40);
    color: #ccc;
  }
}
</style>
