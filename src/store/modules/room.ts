import { ActionContext, Module } from 'vuex'
import { Game, PresentationPayload, Api, Presentation } from './types'

export enum GameName {
  NONE = '',
  WOWS = 'wows',
  WOT = 'wot'
}

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

export enum RoomAction {
  SET_LOCALE = 'setLocale',
  SET_GAME_NAME = 'setGameName',
  SET_GAME_API = 'setGameApi',
  DELETE_GAME_API = 'deleteGameApi',
  SET_PRESENTATION = 'setPresentation',
  UNSET_PRESENTATION = 'unsetPresentation',
  SET_IS_PRIVATE = 'setIsPrivate',
  SET_IS_CANVAS_LOADED = 'setIsCanvasLoaded',
  SET_ROOM_ID = 'setRoomId'
}

export enum RoomMutation {
  SET_LOCALE = 'SET_LOCALE',
  SET_GAME_NAME = 'SET_GAME_NAME',
  SET_GAME_API = 'SET_GAME_API',
  DELETE_GAME_API = 'DELETE_GAME_API',
  SET_PRESENTATION = 'SET_PRESENTATION',
  UNSET_PRESENTATION = 'UNSET_PRESENTATION',
  SET_IS_PRIVATE = 'SET_IS_PRIVATE',
  SET_IS_CANVAS_LOADED = 'SET_IS_CANVAS_LOADED',
  SET_ROOM_ID = 'SET_ROOM_ID'
}

export enum RoomGetters {
  LOCALE = 'locale',
  GAME_NAME = 'gameName',
  GAME_API = 'gameApi',
  PRESENTATION = 'presentation',
  IS_PRIVATE = 'isPrivate',
  IS_CANVAS_LOADED = 'isCanvasLoaded',
  ROOM_ID = 'roomId'
}

export interface RoomState {
  locale: Locale;
  game: Game;
  presentation: Presentation;
  isPrivate: boolean;
  isCanvasLoaded: boolean;
  roomId: string | undefined;
}

type RoomActionContext = ActionContext<RoomState, {}>

const RoomModule: Module<RoomState, {}> = {
  namespaced: true,
  state () {
    return {
      locale: Locale['EN'],
      game: {
        name: GameName['NONE'],
        api: []
      },
      presentation: {
        enabledBy: undefined,
        tacticId: undefined
      },
      isPrivate: false,
      isCanvasLoaded: false,
      roomId: undefined
    }
  },
  getters: {
    [RoomGetters.LOCALE]: state => state.locale,
    [RoomGetters.GAME_NAME]: state => state.game.name,
    [RoomGetters.GAME_API]: state => state.game.api,
    [RoomGetters.PRESENTATION]: state => ({
      enabledBy: state.presentation.enabledBy,
      tacticId: state.presentation.tacticId
    }),
    [RoomGetters.IS_PRIVATE]: state => state.isPrivate,
    [RoomGetters.IS_CANVAS_LOADED]: state => state.isCanvasLoaded,
    [RoomGetters.ROOM_ID]: state => state.roomId
  },
  mutations: {
    [RoomMutation.SET_LOCALE] (state: RoomState, payload: Locale) {
      state.locale = payload
    },
    [RoomMutation.SET_GAME_NAME] (state: RoomState, name: GameName) {
      state.game.name = name
    },
    [RoomMutation.SET_GAME_API] (state: RoomState, payload: Api) {
      state.game.api.push(payload)
    },
    [RoomMutation.DELETE_GAME_API] (state: RoomState) {
      state.game.api = []
    },
    [RoomMutation.SET_PRESENTATION] (state: RoomState, payload: PresentationPayload) {
      state.presentation.enabledBy = payload.enabledBy
      state.presentation.tacticId = payload.tacticId
    },
    [RoomMutation.UNSET_PRESENTATION] (state: RoomState) {
      state.presentation.enabledBy = undefined
      state.presentation.tacticId = undefined
    },
    [RoomMutation.SET_IS_PRIVATE] (state: RoomState, isPrivate: boolean) {
      state.isPrivate = isPrivate
    },
    [RoomMutation.SET_IS_CANVAS_LOADED] (state: RoomState, isCanvasLoaded: boolean) {
      state.isCanvasLoaded = isCanvasLoaded
    },
    [RoomMutation.SET_ROOM_ID] (state: RoomState, roomId: string) {
      state.roomId = roomId
    }
  },
  actions: {
    [RoomAction.SET_LOCALE] (context: RoomActionContext, payload: Locale) {
      context.commit('SET_LOCALE', payload)
    },
    [RoomAction.SET_GAME_NAME] (context: RoomActionContext, name: GameName) {
      context.commit('SET_GAME_NAME', name)
    },
    // eslint-disable-next-line
    [RoomAction.SET_GAME_API] (context: RoomActionContext, payload: any) {
      context.commit('SET_GAME_API', payload)
    },
    [RoomAction.DELETE_GAME_API] (context: RoomActionContext) {
      context.commit('DELETE_GAME_API')
    },
    [RoomAction.SET_PRESENTATION] (context: RoomActionContext, payload: PresentationPayload) {
      context.commit('SET_PRESENTATION', payload)
    },
    [RoomAction.UNSET_PRESENTATION] (context: RoomActionContext) {
      context.commit('SET_PRESENTATION')
    },
    [RoomAction.SET_IS_PRIVATE] (context: RoomActionContext, isPrivate: boolean) {
      context.commit('SET_IS_PRIVATE', isPrivate)
    },
    [RoomAction.SET_IS_CANVAS_LOADED] (context: RoomActionContext, isCanvasLoaded: boolean) {
      context.commit('SET_IS_CANVAS_LOADED', isCanvasLoaded)
    },
    [RoomAction.SET_ROOM_ID] (context: RoomActionContext, roomId: string) {
      context.commit('SET_ROOM_ID', roomId)
    }
  }
}

export default RoomModule
