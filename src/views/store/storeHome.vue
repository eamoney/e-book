<template>
  <div class="store-home">
    <search-bar></search-bar >
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
        <div>1111111111111111</div>
    </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar.vue'
import Scroll from '../../components/common/Scroll.vue'
import { storeHomeMixin } from '../../utils/mixin.js'
import FlapCard from '../../components/home/FlapCard.vue'
import { home } from '../../api/store.js'
export default {
  mixins: [storeHomeMixin],
  data () {
    return {
      scrollTop: 94,
      random: null
    }
  },
  components: {
    SearchBar,
    Scroll,
    FlapCard
  },
  methods: {
    onScroll (offsetY) {
      this.setOffsetY(offsetY)
      if (offsetY > 0) {
        this.scrollTop = 52
      } else {
        this.scrollTop = 94
      }
      this.$refs.scroll.refresh()
    }
  },
  mounted () {
    home().then(res => {
      if (res && res.status === 200) {
        const data = res.data
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
        console.log(this.random)
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/styles/global';
.store-home{
  width: 100%;
  height: 100%;
}
</style>
