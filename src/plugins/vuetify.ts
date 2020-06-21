import Vue from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import '@fortawesome/fontawesome-free/css/all.css'
import colours from '@/assets/scss/_variables.scss'
import { DashedLine, DashedLineActive, NormalLine, NormalLineActive, TBarHead, TBarHeadActive } from '@/assets/tool-icons'

import Vuetify, {
  VApp,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelHeader,
  VExpansionPanelContent,
  VAutocomplete,
  VAvatar,
  VTreeviewNode,
  VBadge,
  VBtn,
  VBtnToggle,
  VCard,
  VCardActions,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VChip,
  VChipGroup,
  VCol,
  VColorPicker,
  VContainer,
  VContent,
  VDialog,
  VDivider,
  VIcon,
  VImg,
  VInput,
  VItemGroup,
  VBottomNavigation,
  VList,
  VListItem,
  VListItemAction,
  VListItemAvatar,
  VListItemContent,
  VListItemIcon,
  VListItemTitle,
  VMenu,
  VNavigationDrawer,
  VOverlay,
  VRadio,
  VRadioGroup,
  VRow,
  VSelect,
  VSheet,
  VSkeletonLoader,
  VSlider,
  VSpacer,
  VSubheader,
  VSwitch,
  VTab,
  VTabItem,
  VTabs,
  VTabsItems,
  VTabsSlider,
  VTextField,
  VToolbar,
  VTooltip,
  VTreeview,
  VListItemGroup,
  VLazy
} from 'vuetify/lib'

Vue.use(Vuetify, {
  components: {
    VApp,
    VBottomNavigation,
    VLazy,
    VExpansionPanels,
    VExpansionPanel,
    VExpansionPanelHeader,
    VExpansionPanelContent,
    VListItemGroup,
    VAvatar,
    VRadioGroup,
    VSwitch,
    VRadio,
    VContainer,
    VTreeviewNode,
    VAutocomplete,
    VBadge,
    VRow,
    VOverlay,
    VImg,
    VTooltip,
    VDivider,
    VToolbar,
    VItemGroup,
    VCardSubtitle,
    VSpacer,
    VBtn,
    VIcon,
    VDialog,
    VCol,
    VBtnToggle,
    VMenu,
    VList,
    VListItem,
    VListItemAction,
    VListItemAvatar,
    VListItemContent,
    VListItemTitle,
    VListItemIcon,
    VContent,
    VSubheader,
    VCard,
    VCardText,
    VCardActions,
    VSheet,
    VColorPicker,
    VSlider,
    VSelect,
    VNavigationDrawer,
    VTextField,
    VChipGroup,
    VChip,
    VSkeletonLoader,
    VInput,
    VCardTitle,
    VTreeview,
    VTab,
    VTabsSlider,
    VTabItem,
    VTabs,
    VTabsItems
  },
  directives: {}
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const opts: Record<string, any> = {
  icons: {
    values: {
      dashedLine: {
        component: DashedLine
      },
      normalLine: {
        component: NormalLine
      },
      tBarHead: {
        component: TBarHead
      },
      dashedLineActive: {
        component: DashedLineActive
      },
      normalLineActive: {
        component: NormalLineActive
      },
      tBarHeadActive: {
        component: TBarHeadActive
      }
    },
    iconfont: 'fa' || 'mdi' // || 'mdiSvg' || 'md' || 'fa' || 'fa4',
  },
  theme: {
    options: {
      customProperties: true
    },
    themes: {
      light: {
        primary: colours.roomPrimary
      }
    }
  }
}

export default new Vuetify(opts)
