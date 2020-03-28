import Vue from 'vue'
import '@fortawesome/fontawesome-free/css/all.css'
import colours from '@/assets/scss/_variables.scss'
import Vuetify, {
  VApp,
  VRadio,
  VRadioGroup,
  VAutocomplete,
  VBadge,
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
  VSelect,
  VSwitch,
  VNavigationDrawer,
  VTextField
} from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VApp,
    VRadioGroup,
    VSwitch,
    VRadio,
    VContainer,
    VAutocomplete,
    VBadge,
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
    VSelect,
    VSwitch,
    VNavigationDrawer,
    VTextField
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
	},
    themes: {
      light: {
        primary: colours.roomNavbar
      }
    }
  }
}

export default new Vuetify(opts)
