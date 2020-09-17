import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './utils/axios'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import './plugins/zTable.js'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
