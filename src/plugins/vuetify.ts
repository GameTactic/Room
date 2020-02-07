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
  VSheet,
  VColorPicker,
  VSlider
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
    VSheet,
    VColorPicker,
    VSlider
  },
  directives: { }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const opts: Record<string, any> = {
  icons: {
    iconfont: 'fa' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  }
}

export default new Vuetify(opts)
