import Vue from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import Vuetify, {
  VApp,
  VRow,
  VToolbar,
  VSpacer,
  VBtn,
  VIcon,
  VCol,
  VBtnToggle,
  VMenu,
  VList,
  VContent,
  VCard,
  VSheet
} from 'vuetify/lib'
// import { Ripple } from 'vuetify/lib/directives'

Vue.use(Vuetify, {
  components: {
    VApp,
    VRow,
    VToolbar,
    VSpacer,
    VBtn,
    VIcon,
    VCol,
    VBtnToggle,
    VMenu,
    VList,
    VContent,
    VCard,
    VSheet
  },
  directives: { }
})

const opts:Object = {
  icons: {
    iconfont: 'fa' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  }
}

export default new Vuetify(opts)
