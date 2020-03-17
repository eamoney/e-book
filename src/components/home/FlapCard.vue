<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation">
      <div class="flap-crad"
             v-for="(item, index) in flapCardList"
             :key="index"
             :style="{zIndex: item.zIndex}">
        <div class="flap-crad-circle">
          <div class="flap-card-semi-circle flap-card-semi-circle-left"
              :style="semiCircleStyle(item, 'left')" ref="left"></div>
          <div class="flap-card-semi-circle flap-card-semi-circle-right"
              :style="semiCircleStyle(item, 'right')" ref="right"></div>
        </div>
      </div> 
      <div class="point-wrapper">
        <div class="point" 
             :class="{'animation': runPointAnimation}"
             v-for="item in pointList"
             :key="item"></div>
      </div>
    </div>
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data ? data.cover : ''">
        </div>
        <div class="content-wrapper">
          <div class="title">{{data ? data.title : ''}}</div>
          <div class="author sub-title-medium">{{data ? data.author : ''}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="close"> 
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixin.js'
import { flapCardList, categoryText } from '../../utils/store.js'
export default {
  mixins: [storeHomeMixin],
  data () {
    return {
      flapCardList,
      front: 0,
      back: 1,
      intervalTime: 25,
      runFlapCardAnimation: false,
      pointList: null,
      runPointAnimation: false,
      runBookCardAnimation: false
    }
  },
  watch: {
    flapCardVisible (v) {
      if (v) {
        this.runAnimation()
      }
    }
  },
  props: {
    data: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  methods: {
    close () {
      this.setFlapCardVisible(false)
      this.stopFlapCardAnimation()
    },
    semiCircleStyle (item, dir) {
      return {
        backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
        backgroundSize: item.backgroundSize,
        backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
      }
    },
    // 旋转的核心方法
    rotate (index, type) {
      const item = this.flapCardList[index]
      let dom
      if (type === 'front') {
        dom = this.$refs.right[index]
      } else {
        dom = this.$refs.left[index]
      }
      // 设置样式
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
    },
    flapCardRotate () {
      // 获取第一张卡片
      const frontFlapCard = this.flapCardList[this.front]
      // 获取第二张卡片
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      backFlapCard.rotateDegree -= 10
      backFlapCard._g += 5
      if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90){
        backFlapCard.zIndex += 2
      }
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        this.next()
      }
    },
    startFlapCradAnimation () {
      this.prepare()
      this.task = setInterval(() => {
        this.flapCardRotate()
      }, this.intervalTime)
    },
    prepare () {
      const backFlapCard = this.flapCardList[this.back]
      backFlapCard.rotateDegree = 180
      backFlapCard._g = backFlapCard._g - 5 * 18
      this.rotate(this.back, 'back')
    },
    next () {
      // 将先前转动过的卡片做一个归位操作
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard.rotateDegree = 0
      backFlapCard._g = backFlapCard.g
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      // 启动下一组卡片的转动
      this.front++
      this.back++
      const len = this.flapCardList.length
      if (this.front >= len) {
        this.front = 0 
      }
      if (this.back >= len) {
        this.back = 0
      }
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len)
      })
      this.prepare()
    },
    stopFlapCardAnimation () {
      if (this.task) {
        clearInterval(this.task)
      }
      if (this.timeout) {
        clearInterval(this.timeout)
      }
      if (this.timeout2) {
        clearInterval(this.timeout2)
      }
      this.reset()
    },
    //  点击关闭按钮的时候 会将所有动画都重置
    reset () {
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      this.runBookCardAnimation = false
      this.runFlapCardAnimation = false
    },
    runAnimation () {
      this.runFlapCardAnimation = true
      this.timeout = setTimeout(() => {
        this.startPointAnimation()
        this.startFlapCradAnimation()
      }, 300)
      this.timeout2 = setTimeout(() => {
        this.stopFlapCardAnimation()
        this.runBookCardAnimation = true
      }, 2500)
    },
    startPointAnimation () {
      this.runPointAnimation = true
      setTimeout(() => {
        this.runPointAnimation = false
      }, 750)
    },
    categoryText () {
      if (this.data) {
        categoryText(this.data.category, this)
      }
    }
  },
  created () {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/styles/global";
@import "../../assets/styles/flapCard";
.flap-card-wrapper{
  @include absCenter;
  z-index: 2000;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, .6);
  @include center;
  .close-btn-wrapper{
    position: absolute;
    left: 0;
    z-index: 2000;
    width: 100%;
    bottom: px2rem(30);
    @include center;
    .icon-close{
      height: px2rem(45);
      width: px2rem(45);
      font-size: px2rem(25);
      border-radius: 50%;
      background: #333;
      color: white;
      @include center;
    }
  }
  .book-card {
      position: relative;
      width: 65%;
      // height: 70%;
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale $animationTime ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
  .flap-card-bg{
    position: relative;
    width: px2rem(64);
    height: px2rem(64);
    border-radius: px2rem(5);
    background: white;
    transform: scale(0);
    opacity: 0;
    &.animation{
      animation: flap-card-move .3s ease-in both;
    }
    @keyframes flap-card-move {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      50% {
        transform: scale(1.2);
        opacity: 1;
      }
      75% {
        transform: scale(.9);
        opacity: 1;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
    .flap-crad{
      width: px2rem(48);
      height: px2rem(48);
      @include absCenter;
      .flap-crad-circle{
        width: 100%;
        height: 100%;
        display: flex;
        .flap-card-semi-circle{
          width: 0 0 50%;
          width: 50%;
          height: 100%;
          background-repeat: no-repeat;
          backface-visibility: hidden;
        }
        .flap-card-semi-circle-left{
          border-radius: px2rem(24) 0 0 px2rem(24);
          background-position: center right;
          transform-origin: right;
        }
        .flap-card-semi-circle-right{
          border-radius: 0 px2rem(24) px2rem(24) 0;
          background-position: center left;
          transform-origin: left;
        }
      }
    }
    .point-wrapper {
      @include absCenter;
      z-index: 1500;
      .point {
        border-radius: 50%;
        @include absCenter;
        &.animation {
          @for $i from 1 to length($moves){
            &:nth-child(#{$i}) {
              @include move($i)
            }
          }
        }
      }
    }
  }
}
</style>
