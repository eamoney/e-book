<template>
  <div class="popup" v-if="popupVisible">
      <transition name="fade">
        <div class="popup-bg" @click="hide" v-show="popupVisible" ></div>
      </transition>
      <transition name="slide-up">
        <div class="popup-wrapper" v-show="visible">
            <div class="popup-tittle" v-if="title && title.length > 0">{{title}}</div>
            <div class="popup-btn"
                 v-for="(item, index) in btn"
                 :key="index"
                 @click="item.click"
                 :class="{'danger': item.type === 'danger'}">
                 {{item.text}}
            </div>
        </div>
      </transition>
  </div>
</template>

<script>
export default {
  name: 'popup',
  data () {
    return {
      popupVisible: false,
      visible: false
    }
  },
  props: {
    title: {
      type: String,
      default () {
        return ''
      }
    },
    btn: {
      type: Array,
      default () {
        return []
      }
    }
  },
  methods: {
    show () {
      this.popupVisible = true
      setTimeout(() => {
        this.visible = true
      })
    },
    hide () {
    //   通过这种方式控制 隐藏时的过度动画才可能生效
      this.visible = false
      setTimeout(() => {
        this.popupVisible = false
      }, 200)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
.popup{
   width: 100%;
   height: 100%;
   position: fixed;
   left: 0;
   right: 0;
   bottom: 0;
   top: 0;
   z-index: 2000;
   background-color: rgba(0, 0, 0, .4);
  .popup-bg{
    width: 100%;
    height: 100%;
  }
  .popup-wrapper{
     width: 100%;
     position: fixed;
     left: 0;
     bottom: 0;
     z-index: 2000;
     background: white;
    .popup-tittle{
      width: 100%;
      height: px2rem(44);
      border-bottom: px2rem(1) solid #eee;
      line-height: px2rem(14);
      font-size: px2rem(12);
      padding: px2rem(15);
      box-sizing: border-box;
      @include center;
      color: #999;
    }
    .popup-btn{
      width: 100%;
      height: px2rem(60);
      border-bottom: px2rem(1) solid #eee;
      font-size: px2rem(16);
      color: #666;
      font-weight: bold;
      @include center;
      &.danger{
        color: $color-pink;
      }
    }
  }
}
</style>
