<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters(['fileName'])
  },
  mounted () {
  }
}
/** 设置rem */
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 50 ? 50 : fontSize
  html.style.fontSize = fontSize + 'px'
})
</script>

<style scoped lang="scss">
@import './assets/styles/global';
 #app {
   width: 100%;
   height: 100%;
   overflow: hidden;
   background-color: #7d8188;
}
</style>
