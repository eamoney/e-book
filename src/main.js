import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/styles/global.scss'
import './assets/fonts/daysOne.css'
import './assets/styles/icon.css'
import i18n from './lang/index.js'
// import './mock/index.js' 无法支持blob

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
