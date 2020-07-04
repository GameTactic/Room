import VueI18n, { LocaleMessages } from 'vue-i18n'
import { locales as distLocales, localeFiles as distLocaleFiles } from '../../translations/room/dist'
import { locales as localLocales, localeFiles as localLocaleFiles } from '../../translations/room/src'

import Vue from 'vue'
let locales
let localesFiles
// Development related
if (module.hot) {
  locales = localLocales
  localesFiles = localLocaleFiles
} else {
  locales = distLocales
  localesFiles = distLocaleFiles
}

const messages: LocaleMessages = locales as LocaleMessages
Vue.use(VueI18n)
const i18n = new VueI18n({ locale: process.env.VUE_APP_LOCALE ? process.env.VUE_APP_LOCALE : navigator.languages[0], fallbackLocale: process.env.VUE_APP_DEFAULT_LOCALE, messages })
export default i18n
export const localeFiles = localesFiles
export const defaultLocale = process.env.VUE_DEFAULT_LOCALE
