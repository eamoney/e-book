<template>
  <div class="ebook-slide-contents">
    <div class="slide-contents-search-wrapper">
      <div class="slide-contents-search-input-wrapper">
        <div class="slide-contents-search-icon">
          <span class="icon-search"></span>
        </div>
        <input type="text"
               class="slide-contents-search-input"
               :placeholder="$t('book.searchHint')"
               v-model="searchText"
               @keyup.enter.exact="search()"
               @click="showSearchPage()">
      </div>
      <div class="slide-contents-search-cancel"
           v-if="searchVisible"
           @click="hideSearchPage()">{{$t('book.cancel')}}</div>
    </div>
    <div class="slide-contents-book-wrapper" v-show="!searchVisible">
      <div class="slide-contents-book-img-wrapper">
          <img class="slide-contents-book-img" :src="cover">
      </div>
      <div class="slide-contents-book-info-wrapper">
          <div class="slide-contents-book-title">
            <span class="slide-contents-book-title-text">{{metadata.title}}</span>
          </div>
          <div class="slide-contents-book-author">
            <span class="slide-contents-book-author-text">{{metadata.creator}}</span>
          </div>
      </div>
      <div class="slide-contents-book-progress-wrapper">
          <div class="slide-content-book-progress">
             <span class="progress">{{progress + '%'}}</span>
             <span class="progress-text">{{$t('book.haveRead2')}}</span>
          </div>
          <div class="silde-contents-book-time">{{getReadTimeText()}}</div>
      </div>
    </div>
    <scroll class="slide-contents-list"
            :top="156" :bottom="48" ref="scroll"
             v-show="!searchVisible">
      <div class="slide-contents-item" 
        v-for="(item, index) in navigation"
        :key="index">
        <span class="slide-contents-item-label" 
        @click=displayNavigation(item.href)
        :style="contentItemStyle(item)"
        :class="{'selected': section === index}">
          {{item.label}}</span>
        <span class="slide-contents-item-page"></span>
      </div>
    </scroll>  
    <scroll class="slide-search-list"
            :top="66"
            :bottom="48"
            v-show="searchVisible">
      <div class="slide-search-item" 
           v-for="(item, index) in searchList"
           :key="index"
           @click="displaySearch(item.cfi, true)"
           v-html="item.excerpt"></div>
    </scroll>
  </div>
</template>

<script>
import { ebookMixin } from '../../../utils/mixin.js'
import Scroll from '../../common/Scroll.vue'
import { px2rem } from '../../../utils/utils.js'
export default {
  mixins: [ebookMixin],
  data () {
    return {
      searchVisible: false,
      searchList: null,
      searchText: ''
    }
  },
  components: {
    Scroll
  },
  methods: {
    search () {
      if (this.searchText && this.searchText.length > 0) {
        this.doSearch('added').then(res => {
          this.searchList = res
          this.searchList.map(item => { 
            item.excerpt = item.excerpt.replace(this.searchText, 
          `<span class="content-search-text">${this.searchText}</span>`)
            return item 
          }
          )
        })
      }
    },
    doSearch (q) {
      return Promise.all(
        this.currentBook.spine.spineItems.map(
          item => item.load(this.currentBook.load.bind(this.currentBook))
            .then(item.find.bind(item, q))
            .finally(item.unload.bind(item)))
      ).then(results => Promise.resolve([].concat.apply([], results)))
    },
    displaySearch (target, highlight = false) {
      this.display(target, () => {
        this.hideTitleMenu() 
      })
      if (highlight) {
        this.currentBook.rendition.annotations.highlight(target)
      }
    },
    displayNavigation (target){
      this.display(target, () => {
        /** 切换章节之后立刻隐藏 */
        this.hideTitleMenu()
      })
    },
    hideSearchPage () {
      this.searchVisible = false
      this.searchText = ''
      this.searchList = null
    },
    showSearchPage () {
      this.searchVisible = true
    },
    contentItemStyle (item) {
      return {
        marginLeft: `${px2rem(item.level * 15)}rem`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/styles/global.scss';
.ebook-slide-contents{
  width: 100%;
  font-size: 0;
  .slide-contents-search-wrapper{
    display: flex;
    width: 100%;
    height: px2rem(30);
    margin: px2rem(20) 0 px2rem(10) 0;
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-search-input-wrapper{
      flex:1;
      @include center;
      .slide-contents-search-icon{
        flex: 0 0 px2rem(28);
        font-size: px2rem(12);
        @include center;
      }
      .slide-contents-search-input{
        flex: 1;
        width: 100%;
        height: px2rem(32);
        font-size: px2rem(14);
        background: transparent;
        border: none;
        &:focus{
          outline: none;
        }
      }
    }
    .slide-contents-search-cancel{
     flex: 0 0 px2rem(50);
     font-size: px2rem(14);
     @include right;
    }
  }
  .slide-contents-book-wrapper{
    display: flex;
    width: 100%;
    height: px2rem(90);
    padding: px2rem(10) px2rem(15) px2rem(20);
    box-sizing: border-box;
    .slide-contents-book-img-wrapper{
      flex: 0 0 px2rem(45);
      .slide-contents-book-img{
        width: px2rem(45);
        height: px2rem(60);
      }
    }
    .slide-contents-book-info-wrapper{
      flex: 1;
      padding: 0 px2rem(10);
      box-sizing: border-box;
      .slide-contents-book-title{
        //375*0.85=318.75-30-20-45-70=153.75
        // width: px2rem(153.75);
        font-size: px2rem(14);
        @include left;
        .slide-contents-book-title-text{
          @include ellipsis2(3);
        }
      }
      .slide-contents-book-author{
        // width: px2rem(153.75);
        font-size: px2rem(12);
        @include left
        line-height: px2rem(14);
        .slide-contents-book-author-text{
        @include ellipsis2(1);
        }
      }
    }
    .slide-contents-book-progress-wrapper{
      flex: 0 0 px2rem(70);
      .slide-content-book-progress{
        .progress{
          font-size: px2rem(14);
        }
        .progress-text{
          font-size: px2rem(14);
        }
      }
      .silde-contents-book-time{
        font-size: px2rem(12);
      }
    }
  }
  .slide-contents-list{
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-contents-item{
      display: flex;
      padding: px2rem(20) 0;
      box-sizing: border-box;
      .slide-contents-item-label{
        flex:1;
        font-size: px2rem(14);
        @include ellipsis;
        line-height: px2rem(18);
      }
      .slide-contents-item-page{}
    }
  }
  .slide-search-list{
    padding: 0 px2rem(15);
    box-sizing: border-box;
    .slide-search-item{
      font-size: px2rem(14);
      line-height: px2rem(16);
      padding: px2rem(20) 0;
      box-sizing: border-box;
    }
  }
}
</style>
