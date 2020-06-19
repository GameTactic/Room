import { ActionContext, Module } from 'vuex'
import { Collection, Tactic, RootState } from '../../types'

export enum SocketTacticAction {
  SET_COLLECTIONS = 'setCollections',
  SET_COLLECTION = 'setCollection',
  UPDATE_COLLECTION = 'updateCollection',
  DELETE_COLLECTION = 'deleteCollection',
  SET_TACTICS = 'setSocketTactics',
  SET_TACTIC = 'setSocketTactic',
  TOGGLE_PIN_TACTIC = 'togglePinSocketTactic',
  UPDATE_TACTIC = 'updateSocketTactic',
  DELETE_TACTIC = 'deleteSocketTactic'
}

export enum SocketTacticMutation {
  SET_COLLECTIONS = 'SET_COLLECTIONS',
  SET_COLLECTION = 'SET_COLLECTION',
  UPDATE_COLLECTION = 'UPDATE_COLLECTION',
  DELETE_COLLECTION = 'DELETE_COLLECTION',
  SET_TACTICS = 'SET_TACTICS',
  SET_TACTIC = 'SET_TACTIC',
  TOGGLE_PIN_TACTIC = 'TOGGLE_PIN_TACTIC',
  UPDATE_TACTIC = 'UPDATE_TACTIC',
  DELETE_TACTIC = 'DELETE_TACTIC'
}

export enum SocketTacticGetters {
  COLLECTIONS = 'collections',
  COLLECTION = 'collection',
  TACTICS = 'tactics',
  TACTIC = 'tactic',
  PINNED_TACTICS = 'pinnedSocketTactics'
}

export interface SocketTacticState {
  collections: Collection[];
  tactics: Tactic[];
}

type SocketTacticActionContext = ActionContext<SocketTacticState, RootState>

const SocketTacticModule: Module<SocketTacticState, RootState> = {
  namespaced: true,
  state () {
    return {
      collections: [],
      tactics: []
    }
  },
  getters: {
    [SocketTacticGetters.COLLECTIONS]: (state): Collection[] => state.collections,
    [SocketTacticGetters.COLLECTION]: (state) => (id: string): Collection | undefined => state.collections.find((collection: Collection) => collection.id === id),
    [SocketTacticGetters.TACTICS]: (state): Tactic[] => state.tactics,
    [SocketTacticGetters.TACTIC]: (state) => (id: string): Tactic | undefined => state.tactics.find((tactic: Tactic) => tactic.id === id),
    [SocketTacticGetters.PINNED_TACTICS]: (state): Tactic[] => state.tactics.filter((tactic: Tactic) => tactic.pinned)
  },
  mutations: {
    [SocketTacticMutation.SET_COLLECTIONS] (state: SocketTacticState, payload: Collection[]) {
      state.collections = payload
    },
    [SocketTacticMutation.SET_COLLECTION] (state: SocketTacticState, payload: Collection) {
      state.collections.push(payload)
    },
    [SocketTacticMutation.UPDATE_COLLECTION] (state: SocketTacticState, payload: Collection) {
      state.collections.splice(state.collections.findIndex((collection: Collection) => collection.id === payload.id), 1, payload)
    },
    [SocketTacticMutation.DELETE_COLLECTION] (state: SocketTacticState, id: string) {
      state.collections.splice(state.collections.findIndex((collection: Collection) => collection.id === id), 1)
    },
    [SocketTacticMutation.SET_TACTICS] (state: SocketTacticState, payload: Tactic[]) {
      state.tactics = payload
    },
    [SocketTacticMutation.TOGGLE_PIN_TACTIC] (state: SocketTacticState, payload: Tactic) {
      state.tactics.splice(state.tactics.findIndex((tactic: Tactic) => tactic.id === payload.id), 1, { ...payload, pinned: !payload.pinned })
    },
    [SocketTacticMutation.SET_TACTIC] (state: SocketTacticState, payload: Tactic) {
      state.tactics.push(payload)
    },
    [SocketTacticMutation.UPDATE_TACTIC] (state: SocketTacticState, payload: Tactic) {
      state.tactics.splice(state.tactics.findIndex((tactic: Tactic) => tactic.id === payload.id), 1, payload)
    },
    [SocketTacticMutation.DELETE_TACTIC] (state: SocketTacticState, id: string) {
      state.tactics.splice(state.tactics.findIndex((tactic: Tactic) => tactic.id === id), 1)
    }
  },
  actions: {
    [SocketTacticAction.SET_COLLECTIONS] (context: SocketTacticActionContext, payload: Collection[]) {
      context.commit('SET_COLLECTIONS', payload)
    },
    [SocketTacticAction.SET_COLLECTION] (context: SocketTacticActionContext, payload: Collection) {
      context.commit('SET_COLLECTION', payload)
    },
    [SocketTacticAction.UPDATE_COLLECTION] (context: SocketTacticActionContext, payload: Collection) {
      context.commit('UPDATE_COLLECTION', payload)
    },
    [SocketTacticAction.DELETE_COLLECTION] (context: SocketTacticActionContext, id: string) {
      context.commit('DELETE_COLLECTION', id)
    },
    [SocketTacticAction.SET_TACTICS] (context: SocketTacticActionContext, payload: Tactic[]) {
      context.commit('SET_TACTICS', payload)
    },
    [SocketTacticAction.SET_TACTIC] (context: SocketTacticActionContext, payload: Tactic) {
      context.commit('SET_TACTIC', payload)
    },
    [SocketTacticAction.TOGGLE_PIN_TACTIC] (context: SocketTacticActionContext, payload: Tactic) {
      context.commit('TOGGLE_PIN_TACTIC', payload)
    },
    [SocketTacticAction.UPDATE_TACTIC] (context: SocketTacticActionContext, payload: Tactic) {
      context.commit('UPDATE_TACTIC', payload)
    },
    [SocketTacticAction.DELETE_TACTIC] (context: SocketTacticActionContext, id: string) {
      context.commit('DELETE_TACTIC', id)
    }
  }
}

export default SocketTacticModule
