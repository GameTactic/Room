import { ActionContext, Module } from 'vuex'
import { Api, RootState } from '@/store/types'

export enum Locale {
  CS = 'cs',
  DA = 'da',
  DE = 'de',
  EL = 'el',
  EN = 'en',
  ES = 'es',
  FI = 'fi',
  FR = 'fr',
  HU = 'hu',
  IT = 'it',
  NL = 'nl',
  NO = 'no',
  PL = 'pl',
  RO = 'ro',
  RU = 'ru',
  SR = 'sr',
  SV = 'sv',
  TR = 'tr',
  UK = 'uk',
  ZH = 'zh'
}

export enum AppRoomAction {
  SET_LOCALE = 'setLocale',
  ADD_API = 'setGameApi',
  DELETE_API = 'deleteGameApi',
  SET_IS_CANVAS_LOADED = 'setIsCanvasLoaded'
}

export enum AppRoomMutation {
  SET_LOCALE = 'SET_LOCALE',
  ADD_API = 'ADD_API',
  DELETE_API = 'DELETE_API',
  SET_IS_CANVAS_LOADED = 'SET_IS_CANVAS_LOADED'
}

export enum AppRoomGetters {
  LOCALE = 'locale',
  API = 'api',
  IS_CANVAS_LOADED = 'isCanvasLoaded'
}

export interface AppRoomState {
  locale: Locale;
  api: Api[];
  isCanvasLoaded: boolean;
}

type AppRoomActionContext = ActionContext<AppRoomState, RootState>

const AppRoomModule: Module<AppRoomState, RootState> = {
  namespaced: true,
  state () {
    return {
      locale: Locale['EN'],
      api: [],
      isCanvasLoaded: false
    }
  },
  getters: {
    [AppRoomGetters.LOCALE]: (state): Locale => state.locale,
    [AppRoomGetters.API]: (state): Api[] => state.api,
    [AppRoomGetters.IS_CANVAS_LOADED]: (state): boolean => state.isCanvasLoaded
  },
  mutations: {
    [AppRoomMutation.SET_LOCALE] (state: AppRoomState, payload: Locale) {
      state.locale = payload
    },
    [AppRoomMutation.ADD_API] (state: AppRoomState, payload: Api) {
      state.api.push(payload)
    },
    [AppRoomMutation.DELETE_API] (state: AppRoomState) {
      state.api = []
    },
    [AppRoomMutation.SET_IS_CANVAS_LOADED] (state: AppRoomState, isCanvasLoaded: boolean) {
      state.isCanvasLoaded = isCanvasLoaded
    }
  },
  actions: {
    [AppRoomAction.SET_LOCALE] (context: AppRoomActionContext, payload: Locale) {
      context.commit('SET_LOCALE', payload)
    },
    // eslint-disable-next-line
    [AppRoomAction.ADD_API] (context: AppRoomActionContext, payload: any) {
      context.commit('ADD_API', payload)
    },
    [AppRoomAction.DELETE_API] (context: AppRoomActionContext) {
      context.commit('DELETE_API')
    },
    [AppRoomAction.SET_IS_CANVAS_LOADED] (context: AppRoomActionContext, isCanvasLoaded: boolean) {
      context.commit('SET_IS_CANVAS_LOADED', isCanvasLoaded)
    }
  }
}

export default AppRoomModule
