<template>
  <div class="store-home">
    <search-bar></search-bar >
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
      <div class="banner-wrapper">
        <!-- <img :src="banner" class="img"> -->
        <div class="img" :style="{backgroundImage:`url('${banner}')`}"></div>
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <recommend class="recommend" :data="recommend"></recommend>
      <featured class="featured" 
                :data="featured" 
                :titleText="$t('home.featured')"
                :btnText="$t('home.seeAll')"></featured>
      <div class="category-list-wrapper"
           v-for="(item, index) in categoryList"
           :key="index">
           <category-book :data="item"></category-book>
      </div>       
      <category class="categorys" :data="categorys"></category>  
    </scroll>
  </div>
</template>

<script>
import SearchBar from '../../components/home/SearchBar.vue'
import Scroll from '../../components/common/Scroll.vue'
import { storeHomeMixin } from '../../utils/mixin.js'
import FlapCard from '../../components/home/FlapCard.vue'
import GuessYouLike from '../../components/home/GuessYouLike.vue'
import Recommend from '../../components/home/Recommend.vue'
import Featured from '../../components/home/Featured.vue'
import CategoryBook from '../../components/home/CategoryBook.vue'
import Category from '../../components/home/Category.vue'
import { home } from '../../api/store.js'
export default {
  mixins: [storeHomeMixin],
  data () {
    return {
      scrollTop: 94,
      random: null,
      banner: '',
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categorys: null
    }
  },
  components: {
    SearchBar,
    Scroll,
    FlapCard,
    GuessYouLike,
    Recommend,
    Featured,
    CategoryBook,
    Category
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
        this.banner = data.banner
        this.guessYouLike = data.guessYouLike
        this.recommend = data.recommend
        this.featured = data.featured
        this.categoryList = data.categoryList
        this.categorys = data.categories
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
  .banner-wrapper{
    padding: px2rem(10);
    box-sizing: border-box;
    width: 100%;
    .img{
      width: 100%;
      height: px2rem(140);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      background-origin: center center;
    }
  }
  .recommend {
    margin-top: px2rem(20);
  }
  .featured{
    margin-top: px2rem(20);
  }
  .category-list-wrapper {
    margin-top: px2rem(20);
  }
  .categorys {
    margin-top: px2rem(20);
  }
}
</style>
