import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import VueKonva from 'vue-konva'
import App from './App.vue'
import './registerServiceWorker'
import router from './router/index'
import store from './store'

let socket = new WebSocket('ws://localhost:80')
Vue.prototype.$socket = socket

Vue.config.productionTip = false
Vue.use(VueKonva)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
