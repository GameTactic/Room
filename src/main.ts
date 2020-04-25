import Vue from 'vue'
import './registerServiceWorker'
import vuetify from '@/plugins/vuetify'
import VueKonva from 'vue-konva'
import router from './router/index'
import store from './store'
import App from './App.vue'
import socket from '@/plugins/socket'
import './plugins/sentry'
import values from 'lodash.values'
import i18n, { localeFiles } from './lib/I18n'

socket(store, Vue)
Vue.use(VueKonva)
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')

// Development related
if (module.hot) {
  module.hot.accept(values(localeFiles), async () => {
    for (const locale in localeFiles) {
      const requiredLocale = await import(`../translations/room/dist/messages.${locale}.json`)
      i18n.setLocaleMessage(locale, requiredLocale)
    }
  })
}
