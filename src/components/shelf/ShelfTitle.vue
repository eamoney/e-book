<template>
  <transition name="fade">
    <div class="shelf-title" 
        :class="{'hide-shaow':ifHideShadow}"
         v-show="shelfTitleVisible">
       <div class="shelf-title-text-wrapper">
           <span class="shelf-title-text">{{title}}</span>
           <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
       </div>
       <div class="shelf-title-btn-wrapper shelf-title-left"
            v-if="showClear">
           <span class="shelf-title-btn-text" @click="clearCache">
             {{$t('shelf.clearCache')}}
             </span>
       </div>
      <div class="shelf-title-btn-wrapper shelf-title-right" v-if="showEdit">
           <span class="shelf-title-btn-text" @click="onEditClick">
             {{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span>
       </div>
      <div class="shelf-title-btn-wrapper shelf-title-left"
           v-if="showBack">
           <span class="icon-back" @click="back"></span>
       </div>
      <div class="shelf-title-btn-wrapper"
          :class="{'shelf-title-left':changeGroupLeft, 'shelf-title-right':changeGroupRight}"
           v-if="showChangeGroup"
           @click="changeGroup">
           <span class="shelf-title-btn-text">
             {{$t('shelf.editGroup')}}
           </span>
       </div>
    </div>
  </transition>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixin.js'
import { clearLocalStorage, saveBookShelf } from '../../utils/localStorage'
import { clearLocalForage } from '../../utils/localForage.js'
export default {
  mixins: [storeShelfMixin],
  data () {
    return {
      ifHideShadow: true,
      popupMenu: null
    }
  },
  computed: {
    emptyCategory () {
      return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
    },
    showEdit () {
      return this.currentType === 1 || !this.emptyCategory
    },
    showClear () {
      return this.currentType === 1
    },
    showBack () {
      return this.currentType === 2 && !this.isEditMode
    },
    showChangeGroup () {
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
    },
    changeGroupLeft () {
      return this.showEdit && this.isEditMode
    },
    changeGroupRight () {
      return this.currentType === 2 && this.emptyCategory
    },
    selectedText () {
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
      return selectedNumber <= 0 ? this.$t('shelf.selectBook') 
        : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber)
          : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
    },
    popupCancelBtn () {
      return this.createPopupBtn(this.$t('shelf.cancel'), () => {
        this.hidePopup()
      })
    }
  },
  props: {
    title: String
  },
  methods: {
    back () {
      this.$router.go(-1)
      this.setIsEditMode(false)
    },
    onEditClick () {
      if (!this.isEditMode) {
        this.setShelfSelected([])
        this.shelfList.forEach(item => {
          item.selected = false
          if (item.itemList) {
            item.itemList.forEach(subItem => {
              subItem.selected = false
            })
          }
        })
      }
      this.setIsEditMode(!this.isEditMode)
    },
    clearCache () {
      clearLocalStorage()
      clearLocalForage()
      this.setShelfSelected([])
      this.setShelfList([])
      this.getShelfList()
      this.simpleToast(this.$t('shelf.clearCacheSuccess'))
    },
    changeGroupName () {
      this.hidePopup()
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title
      }).show()
    },
    deleteGroup () {
      if (!this.emptyCategory) {
        this.setShelfSelected(this.shelfCategory.itemList)
        this.moveOutOfGroup(this.onComplete)
      } else {
        this.onComplete()
      }
    },
    showDeleteGroup () {
      this.hidePopup()
      setTimeout(() => {
        this.popupMenu = this.popup({
          title: this.$t('shelf.deleteGroupTitle'),
          btn: [
            this.createPopupBtn(this.$t('shelf.confirm'), () => {
              this.deleteGroup()
            }, 'danger'),
            this.popupCancelBtn
          ]
        }).show()
      }, 200)
    },
    createPopupBtn (text, onClick, type = 'normal') {
      return {
        text: text,
        type: type,
        click: onClick
      }
    },
    hidePopup () {
      this.popupMenu.hide()
    },
    changeGroup () {
      this.popupMenu = this.popup({
        btn: [
          this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
            this.changeGroupName()
          }),
          this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
            this.showDeleteGroup()
          }, 'danger'),
          this.popupCancelBtn
        ]
      }).show()
    },
    onComplete () {
      this.hidePopup()
      this.setShelfList(this.shelfList.filter(book => 
        book.id !== this.shelfCategory.id)).then(() => {
        saveBookShelf(this.shelfList)
        this.$router.go(-1)
        this.setIsEditMode(false)
      })
    }
  },
  watch: {
    offsetY (v) {
      if (v > 0) {
        this.ifHideShadow = false
      } else {
        this.ifHideShadow = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.shelf-title{
  position: relative;
  width: 100%;
  height: px2rem(42);
  background: white;
  z-index:130;
  box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
  &.hide-shaow{
    box-shadow: none;
  }
  .shelf-title-text-wrapper{
    height: px2rem(42);
    @include columnCenter;
    .shelf-title-text{
      font-size: px2rem(16);
      line-height: px2rem(20);
      font-weight: bold;
      color: #333;
    }
    .shelf-title-sub-text{
      font-size: px2rem(10);
      color: #333;
    }
  }
  .shelf-title-btn-wrapper{
    position: absolute;
    top: 0;
    box-sizing: border-box;
    height: 100%;
    @include center;
    .icon-back{
      font-size: px2rem(20);
      color: #666;
    }
    .shelf-title-btn-text{
      font-size: px2rem(14);
      color: #666;
    }
    &.shelf-title-left{
      left: 0;
      padding-left: px2rem(15);
    }
    &.shelf-title-right{
      right: 0;
      padding-right: px2rem(15);
    }
  }
}
</style>
