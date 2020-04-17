import { ActionContext, Module } from 'vuex'
import { Game, Collection, Tactic, User, PresentationPayload, Api } from './types'

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
  SET_COLLECTIONS = 'setCollections',
  SET_COLLECTION = 'setCollection',
  UPDATE_COLLECTION = 'updateCollection',
  DELETE_COLLECTION = 'deleteCollection',
  SET_TACTICS = 'setTactics',
  SET_TACTIC = 'setTactic',
  UPDATE_TACTIC = 'updateTactic',
  DELETE_TACTIC = 'deleteTactic',
  SET_USERS = 'setUsers',
  SET_USER = 'setUser',
  UPDATE_USER = 'updateUser',
  DELETE_USER = 'deleteUser',
  SET_PRESENTATION = 'setPresentation',
  SET_IS_PRIVATE = 'setIsPrivate'
}

export enum RoomMutation {
  SET_LOCALE = 'SET_LOCALE',
  SET_GAME_NAME = 'SET_GAME_NAME',
  SET_GAME_API = 'SET_GAME_API',
  DELETE_GAME_API = 'DELETE_GAME_API',
  SET_COLLECTIONS = 'SET_COLLECTIONS',
  SET_COLLECTION = 'SET_COLLECTION',
  UPDATE_COLLECTION = 'UPDATE_COLLECTION',
  DELETE_COLLECTION = 'DELETE_COLLECTION',
  SET_TACTICS = 'SET_TACTICS',
  SET_TACTIC = 'SET_TACTIC',
  UPDATE_TACTIC = 'UPDATE_TACTIC',
  DELETE_TACTIC = 'DELETE_TACTIC',
  SET_USERS = 'SET_USERS',
  SET_USER = 'SET_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',
  SET_PRESENTATION = 'SET_PRESENTATION',
  SET_IS_PRIVATE = 'SET_IS_PRIVATE'
}

export enum RoomGetters {
  LOCALE = 'locale',
  GAME_NAME = 'gameName',
  GAME_API = 'gameApi',
  COLLECTIONS = 'collections',
  COLLECTION = 'collection',
  TACTICS = 'tactics',
  TACTIC = 'tactic',
  USERS = 'users',
  USER = 'user',
  PRESENTATION = 'presentation',
  IS_PRIVATE = 'isPrivate'
  ROOM_MAPS = 'roomMaps'
}

export interface RoomState {
  locale: Locale;
  game: Game;
  collections: Collection[];
  tactics: Tactic[];
  users: User[];
  isPresentationEnabled: boolean;
  presentationEnabledBy: string | undefined;
  isPrivate: boolean;
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
      collections: [],
      tactics: [],
      users: [],
      isPresentationEnabled: false,
      presentationEnabledBy: undefined,
      isPrivate: false
    }
  },
  getters: {
    [RoomGetters.LOCALE]: state => state.locale,
    [RoomGetters.GAME_NAME]: state => state.game.name,
    [RoomGetters.USERS]: state => state.users,
    [RoomGetters.USER]: (state) => (jti: string) => state.users.find((user: User) => user.jti === jti),
    [RoomGetters.PRESENTATION]: state => ({ isPresentationEnabled: state.isPresentationEnabled, presentationEnabledBy: state.presentationEnabledBy }),
    [RoomGetters.IS_PRIVATE]: state => state.isPrivate
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
    [RoomMutation.SET_COLLECTIONS] (state: RoomState, payload: Collection[]) {
      state.collections = payload
    },
    [RoomMutation.SET_COLLECTION] (state: RoomState, payload: Collection) {
      state.collections.push(payload)
    },
    [RoomMutation.UPDATE_COLLECTION] (state: RoomState, payload: Collection) {
      state.collections.splice(state.collections.findIndex((collection: Collection) => collection.id === payload.id), 1, payload)
    },
    [RoomMutation.DELETE_COLLECTION] (state: RoomState, id: string) {
      state.collections.splice(state.collections.findIndex((collection: Collection) => collection.id === id), 1)
    },
    [RoomMutation.SET_TACTICS] (state: RoomState, payload: Tactic[]) {
      state.tactics = payload
    },
    [RoomMutation.SET_TACTIC] (state: RoomState, payload: Tactic) {
      state.tactics.push(payload)
    },
    [RoomMutation.UPDATE_TACTIC] (state: RoomState, payload: Tactic) {
      state.tactics.splice(state.tactics.findIndex((tactic: Tactic) => tactic.id === payload.id), 1, payload)
    },
    [RoomMutation.DELETE_TACTIC] (state: RoomState, id: string) {
      state.tactics.splice(state.tactics.findIndex((tactic: Tactic) => tactic.id === id), 1)
    },
    [RoomMutation.SET_USERS] (state: RoomState, payload: User[]) {
      state.users = payload
    },
    [RoomMutation.SET_USER] (state: RoomState, payload: User) {
      state.users.push(payload)
    },
    [RoomMutation.UPDATE_USER] (state: RoomState, payload: User) {
      state.users.splice(state.users.findIndex((user: User) => user.jti === payload.jti), 1, payload)
    },
    [RoomMutation.DELETE_USER] (state: RoomState, jti: string) {
      state.users.splice(state.users.findIndex((user: User) => user.jti === jti), 1)
    },
    [RoomMutation.SET_PRESENTATION] (state: RoomState, payload: PresentationPayload) {
      state.isPresentationEnabled = payload.isPresentationEnabled
      state.presentationEnabledBy = payload.presentationEnabledBy
    },
    [RoomMutation.SET_IS_PRIVATE] (state: RoomState, isPrivate: boolean) {
      state.isPrivate = isPrivate
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
    [RoomAction.SET_COLLECTIONS] (context: RoomActionContext, payload: Collection[]) {
      context.commit('SET_COLLECTIONS', payload)
    },
    [RoomAction.SET_COLLECTION] (context: RoomActionContext, payload: Collection) {
      context.commit('SET_COLLECTION', payload)
    },
    [RoomAction.UPDATE_COLLECTION] (context: RoomActionContext, payload: Collection) {
      context.commit('UPDATE_COLLECTION', payload)
    },
    [RoomAction.DELETE_COLLECTION] (context: RoomActionContext, id: string) {
      context.commit('DELETE_COLLECTION', id)
    },
    [RoomAction.SET_TACTICS] (context: RoomActionContext, payload: Tactic[]) {
      context.commit('SET_TACTICS', payload)
    },
    [RoomAction.SET_TACTIC] (context: RoomActionContext, payload: Tactic) {
      context.commit('SET_TACTIC', payload)
    },
    [RoomAction.UPDATE_TACTIC] (context: RoomActionContext, payload: Tactic) {
      context.commit('UPDATE_TACTIC', payload)
    },
    [RoomAction.DELETE_TACTIC] (context: RoomActionContext, id: string) {
      context.commit('DELETE_TACTIC', id)
    },
    [RoomAction.SET_USERS] (context: RoomActionContext, payload: User[]) {
      context.commit('SET_USERS', payload)
    },
    [RoomAction.SET_USER] (context: RoomActionContext, payload: User) {
      context.commit('SET_USER', payload)
    },
    [RoomAction.UPDATE_USER] (context: RoomActionContext, payload: User) {
      context.commit('UPDATE_USER', payload)
    },
    [RoomAction.DELETE_USER] (context: RoomActionContext, jti: string) {
      context.commit('DELETE_USER', jti)
    },
    [RoomAction.SET_PRESENTATION] (context: RoomActionContext, payload: PresentationPayload) {
      context.commit('SET_PRESENTATION', payload)
    },
    [RoomAction.SET_IS_PRIVATE] (context: RoomActionContext, isPrivate: boolean) {
      context.commit('SET_IS_PRIVATE', isPrivate)
    }
  }
}

export default RoomModule
