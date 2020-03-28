import Vue from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import Vuetify, {
  VApp,
  VRadio,
  VRadioGroup,
  VRow,
  VImg,
  VSwitch,
  VDivider,
  VToolbar,
  VItemGroup,
  VContainer,
  VSpacer,
  VBtn,
  VIcon,
  VCardSubtitle,
  VTooltip,
  VCol,
  VBtnToggle,
  VMenu,
  VList,
  VListItem,
  VListItemAction,
  VListItemAvatar,
  VListItemContent,
  VListItemTitle,
  VContent,
  VCard,
  VCardActions,
  VSheet,
  VColorPicker,
  VSlider,
  VNavigationDrawer
} from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VApp,
    VRadioGroup,
    VSwitch,
    VRadio,
    VContainer,
    VRow,
    VImg,
    VTooltip,
    VDivider,
    VToolbar,
    VItemGroup,
    VCardSubtitle,
    VSpacer,
    VBtn,
    VIcon,
    VCol,
    VBtnToggle,
    VMenu,
    VList,
    VListItem,
    VListItemAction,
    VListItemAvatar,
    VListItemContent,
    VListItemTitle,
    VContent,
    VCard,
    VCardActions,
    VSheet,
    VColorPicker,
    VSlider,
    VNavigationDrawer
  },
  directives: { }
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const opts: Record<string, any> = {
  icons: {
    iconfont: 'fa' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
  },
  theme: {
    options: {
      customProperties: true
    }
  }
}

export default new Vuetify(opts)
