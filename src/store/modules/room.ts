import { ActionContext, Module } from 'vuex'

export enum Game {
  NONE = '',
  WOWS = 'wows',
  WOT = 'wot'
}

export enum Locale {
  ENUK = 'en-uk'
}

export enum RoomAction {
  SET_GAME = 'setGame',
  SET_LOCALE = 'setLocale'
}

export enum RoomMutation {
  SET_GAME = 'SET_GAME',
  SET_LOCALE = 'SET_LOCALE'
}

export enum RoomGetters {
  ROOM_STATE = 'roomState',
}

export interface RoomState {
  game: Game;
  locale: Locale;
}

type CursorActionContext = ActionContext<RoomState, {}>

const RoomModule: Module<RoomState, {}> = {
  namespaced: true,
  state () {
    return {
      game: Game['NONE'],
      locale: Locale['ENUK']
    }
  },
  getters: {
    [RoomGetters.ROOM_STATE]: state => ({ game: state.game, locale: state.locale })
  },
  mutations: {
    [RoomMutation.SET_GAME] (state: RoomState, payload: Game) {
      state.game = payload
    },
    [RoomMutation.SET_LOCALE] (state: RoomState, payload: Locale) {
      state.locale = payload
    }
  },
  actions: {
    [RoomAction.SET_GAME] (context: CursorActionContext, payload: Game) {
      context.commit('SET_GAME', payload)
    },
    [RoomAction.SET_LOCALE] (context: CursorActionContext, payload: Locale) {
      context.commit('SET_LOCALE', payload)
    }
  }
}

export default RoomModule
