import CreateAPI from 'vue-create-api'
import Vue from 'vue'
import Toast from '../components/common/Toast.vue'
import Popup from '../components/common/Popup.vue'

Vue.use(CreateAPI)
Vue.createAPI(Toast, true)
Vue.createAPI(Popup, true)
// 使用全局mixin简化
Vue.mixin({
  methods: {
    toast (settings) {
      return this.$createToast({
        $props: settings
      })
    },
    popup (settings) {
      return this.$createPopup({
        $props: settings
      })
    },
    simpleToast (text) {
      const toast = this.toast({
        text: text
      })
      toast.show()
      toast.updateText(text)
    }
  }
})
