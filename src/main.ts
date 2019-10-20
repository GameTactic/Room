import Vue from 'vue'
import vuetify from '@/plugins/vuetify'
import VueKonva from 'vue-konva'
import App from './App.vue'
import './registerServiceWorker'
import router from './router/index'
import store from './store'

Vue.config.productionTip = false
Vue.use(VueKonva)

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
