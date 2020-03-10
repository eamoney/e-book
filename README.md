# e-book

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

前期工作：引入web字体的两种方式 
1.在index.html中通过link标签引入 
2.通过import方式在main.js中引入

设置rem：
document.addEventListener('DOMContentLoaded',()=>{
    const html = document.querySelecter('html')
    let fontSize = window.innerWidth / 10
    fontSize = fontSize > 50 ? 50 : fontSize 
    html.style.fontSize = fontSize + 'px' 
})
引入路由 可以直接返回一个import（路径）方法

安装相关依赖：
npm i node-sass sass-loader --save
npm i ebupjs --save （注意是ebupjs 不是epub.js 下载错误是会报错）

vuex：
有关vuex的 https://blog.csdn.net/weixin_44667072/article/details/101164766
使用mapGetters：
1.import { mapGetters } from 'vuex'
2.computed: {
    ...mapGetters(['属性名'])
}

通过rendition使用触摸屏事件 需要将epub版本降到0.3.71

标题栏和菜单栏的隐藏显示是通过使用vue动画
1.用transition包裹组件 设置name属性
2.通过v-enter v-enter-to v-enter-active设置进入时的动画 将v换成name
3.设置离开时的动画

mixin机制：解决了每个组件都混入相同代码段导致维护性差，组件之前的耦合度高的问题
1.将mapGetters mapAcitons放入新建的mixin.js文件
2.通过import方式引入
3.通过vue的minxis：[] 将混入的内容放入
import { mapGetters, mapActions } from 'vuex'

export const ebookMixin = {
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible'])
  },
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible'
    ])
  }
}
实现了组件间的解耦和复用