<template>
  <div class="shelf-foot" v-show="isEditMode">
    <div class="shelf-foot-tab-wrapper"
         v-for="item in tabs"
         :key="item.index"
         @click="onTabsClick(item)"
         >
      <div class="shelf-foot-tab" :class="{'is-selected': isSelected}">
         <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
         <div class="icon-private-see tab-icon" v-if="item.index ===1 && isPrivate"></div>
         <div class="icon-download tab-icon" v-if="item.index === 2 && !isDownLoad"></div>
         <div class="icon-download-remove tab-icon" v-if="item.index === 2 && isDownLoad"></div>
         <div class="icon-move tab-icon" v-if="item.index === 3"></div>
         <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
         <div class="tab-text" :class="{'remove-text': item.index === 4}">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin.js'
import { saveBookShelf, removeLocalStorage } from '../../utils/localStorage.js'
import { download } from '../../api/store.js'
import { removeLocalForage } from '../../utils/localForage.js'
export default {
  mixins: [storeHomeMixin],
  data () {
    return {
      popupMenu: null
    }
  },
  computed: {
    tabs () {
      return [
        {
          label: this.$t('shelf.private'),
          label2: this.$t('shelf.noPrivate'),
          index: 1
        },
        {
          label: this.$t('shelf.download'),
          label2: this.$t('shelf.delete'),
          index: 2
        },
        {
          label: this.$t('shelf.move'),
          index: 3
        },
        {
          label: this.$t('shelf.remove'),
          index: 4
        }
      ]
    },
    isSelected () {
      return this.shelfSelected && this.shelfSelected.length > 0
    },
    isPrivate () {
      if (!this.isSelected) {
        return false
      } else {
        // 需要每一本书都是私密状态 才会判断他是私密的
        return this.shelfSelected.every(item => item.private)
      }
    },
    isDownLoad () {
      if (!this.isSelected) {
        return false
      } else {
        // 需要每一本书都是私密状态 才会判断他是私密的
        return this.shelfSelected.every(item => item.cache)
      }
    }
  },
  methods: {
    setPrivate () {
      let isPrivate
      if (this.isPrivate) {
        isPrivate = false
      } else {
        isPrivate = true
      }
      this.shelfSelected.forEach(book => {
        book.private = isPrivate
      })
      this.onComplete()
      if (isPrivate) {
        this.simpleToast(this.$t('shelf.setPrivateSuccess'))
      } else {
        this.simpleToast(this.$t('shelf.closePrivateSuccess'))
      }
    },
    hidePopup () {
      this.popupMenu.hide()
    },
    showPrivate () {
      this.popupMenu = this.popup({ 
        title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'), 
        btn: [
          {
            text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
            click: () => {
              this.setPrivate()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    onComplete () {
      this.hidePopup()
      this.setIsEditMode(false)
      saveBookShelf(this.shelfList)
    },
    async setDownLoad () {
      this.onComplete()
      if (this.isDownLoad) {
        this.removeSelectedBook()
        this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
      } else {
        await this.downloadSelectedBook()
        saveBookShelf(this.shelfList)
        this.simpleToast(this.$t('shelf.setDownloadSuccess'))
      }
    },
    showDownLoad () {
      this.popupMenu = this.popup({ 
        title: this.isDownLoad ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'), 
        btn: [
          {
            text: this.isDownLoad ? this.$t('shelf.delete') : this.$t('shelf.open'),
            click: () => {
              this.setDownLoad()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    async downloadSelectedBook () {
      for (let i = 0; i < this.shelfSelected.length; i++){
        await this.downloadBook(this.shelfSelected[i]).then(book => {
          book.cache = true
        })
      }
    },
    removeSelectedBook () {
      Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
        .then(books => {
          books.map(book => {
            book.cache = false
          })
          saveBookShelf(this.shelfList)
        }) 
    },
    removeBook (book) {
      return new Promise((resolve, reject) => {
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
        removeLocalForage(`${book.fileName}`)
        resolve(book)
      })
    },
    downloadBook (book) {
      let text = ''
      const toast = this.toast({
        text: text
      })
      toast.continueShow()
      return new Promise((resolve, reject) => {
        download(book, book => {
          console.log('下载完毕')
          toast.remove() // 这里不使用hide 使用createapi的remove直接移除
          // 回到上面的then
          resolve(book)
        }, reject, progressEvent => {
          const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
          const text = this.$t('shelf.progressDownload')
            .replace('$1', `${book.fileName}.epub(${progress})`)
          toast.updateText(text)
        })
      })
    },
    onTabsClick (item) {
      if (!this.isSelected) {
        return this.simpleToast(this.$t('shelf.tips'))
      }
      switch (item.index) {
        case 1:
          this.showPrivate()
          break
        case 2:
          this.showDownLoad()
          break
        case 3:
          break
        case 4:
          this.showRemove()
          break
      }
    },
    removeSelected () {
      this.shelfSelected.forEach(selected => {
        this.setShelfList(this.shelfList.filter(item => item !== selected))
      })
      this.setShelfSelected([])
      this.onComplete()
    },
    showRemove () {
      let title
      if (this.shelfSelected.length === 1) {
        title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
      } else {
        title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
      }
      this.popupMenu = this.popup({ 
        title: title, 
        btn: [
          {
            text: this.$t('shelf.removeBook'),
            type: 'danger',
            click: () => {
              this.removeSelected()
            }
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    label (item) {
      switch (item.index) {
        case 1:
          return this.isPrivate ? item.label2 : item.label
        case 2:
          return this.isDownLoad ? item.label2 : item.label
        default:
          return item.label
      }
    }
  }
}
</script>

<style lang="scss" scpoed>
@import "../../assets/styles/global";
.shelf-foot{
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 120;
  display: flex;
  width: 100%;
  height: px2rem(48);
  background: white;
  box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
  .shelf-foot-tab-wrapper{
    flex: 1;
    width: 25%;
    height: 100%;
    .shelf-foot-tab{
      width: 100%;
      height: 100%;
      @include columnCenter;
      opacity: .5; 
      &.is-selected{
        opacity: 1;
      }    
      .tab-icon{
        font-size: px2rem(20);
        color: #666;
      }
      .tab-text{
        font-size: px2rem(12);
        margin-top: px2rem(5);
        color: #666;
        &.remove-text{
          color: $color-pink
        }
      }
      .icon-shelf{
        color: $color-pink
      }
    }
  }
}
</style>
