import Vue from 'vue'
import './registerServiceWorker'
import vuetify from '@/plugins/vuetify'
import VueKonva from 'vue-konva'
import router from './router/index'
import store from './store'
import App from './App.vue'

Vue.use(VueKonva)
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
