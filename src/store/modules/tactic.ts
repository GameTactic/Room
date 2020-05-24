import { ActionContext, Module } from 'vuex'
import { Collection, Tactic } from './types'

export enum TacticAction {
  SET_COLLECTIONS = 'setCollections',
  SET_COLLECTION = 'setCollection',
  UPDATE_COLLECTION = 'updateCollection',
  DELETE_COLLECTION = 'deleteCollection',
  SET_TACTICS = 'setTactics',
  SET_TACTIC = 'setTactic',
  TOGGLE_PIN_TACTIC = 'togglePinTactic',
  UPDATE_TACTIC = 'updateTactic',
  DELETE_TACTIC = 'deleteTactic'
}

export enum TacticMutation {
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

export enum TacticGetters {
  COLLECTIONS = 'collections',
  COLLECTION = 'collection',
  TACTICS = 'tactics',
  TACTIC = 'tactic',
  PINNED_TACTICS = 'pinnedTactics'
}

export interface TacticState {
  collections: Collection[];
  tactics: Tactic[];
}

type TacticActionContext = ActionContext<TacticState, {}>

const TacticModule: Module<TacticState, {}> = {
  namespaced: true,
  state () {
    return {
      collections: [],
      tactics: []
    }
  },
  getters: {
    [TacticGetters.COLLECTIONS]: state => state.collections,
    [TacticGetters.COLLECTION]: (state) => (id: string) => state.collections.find((collection: Collection) => collection.id === id),
    [TacticGetters.TACTICS]: state => state.tactics,
    [TacticGetters.TACTIC]: (state) => (id: string) => state.tactics.find((tactic: Tactic) => tactic.id === id),
    [TacticGetters.PINNED_TACTICS]: state => state.tactics.filter((tactic: Tactic) => tactic.pinned)
  },
  mutations: {
    [TacticMutation.SET_COLLECTIONS] (state: TacticState, payload: Collection[]) {
      state.collections = payload
    },
    [TacticMutation.SET_COLLECTION] (state: TacticState, payload: Collection) {
      state.collections.push(payload)
    },
    [TacticMutation.UPDATE_COLLECTION] (state: TacticState, payload: Collection) {
      state.collections.splice(state.collections.findIndex((collection: Collection) => collection.id === payload.id), 1, payload)
    },
    [TacticMutation.DELETE_COLLECTION] (state: TacticState, id: string) {
      state.collections.splice(state.collections.findIndex((collection: Collection) => collection.id === id), 1)
    },
    [TacticMutation.SET_TACTICS] (state: TacticState, payload: Tactic[]) {
      state.tactics = payload
    },
    [TacticMutation.TOGGLE_PIN_TACTIC] (state: TacticState, payload: Tactic) {
      state.tactics.splice(state.tactics.findIndex((tactic: Tactic) => tactic.id === payload.id), 1, { ...payload, pinned: !payload.pinned })
    },
    [TacticMutation.SET_TACTIC] (state: TacticState, payload: Tactic) {
      state.tactics.push(payload)
    },
    [TacticMutation.UPDATE_TACTIC] (state: TacticState, payload: Tactic) {
      state.tactics.splice(state.tactics.findIndex((tactic: Tactic) => tactic.id === payload.id), 1, payload)
    },
    [TacticMutation.DELETE_TACTIC] (state: TacticState, id: string) {
      state.tactics.splice(state.tactics.findIndex((tactic: Tactic) => tactic.id === id), 1)
    }
  },
  actions: {
    [TacticAction.SET_COLLECTIONS] (context: TacticActionContext, payload: Collection[]) {
      context.commit('SET_COLLECTIONS', payload)
    },
    [TacticAction.SET_COLLECTION] (context: TacticActionContext, payload: Collection) {
      context.commit('SET_COLLECTION', payload)
    },
    [TacticAction.UPDATE_COLLECTION] (context: TacticActionContext, payload: Collection) {
      context.commit('UPDATE_COLLECTION', payload)
    },
    [TacticAction.DELETE_COLLECTION] (context: TacticActionContext, id: string) {
      context.commit('DELETE_COLLECTION', id)
    },
    [TacticAction.SET_TACTICS] (context: TacticActionContext, payload: Tactic[]) {
      context.commit('SET_TACTICS', payload)
    },
    [TacticAction.SET_TACTIC] (context: TacticActionContext, payload: Tactic) {
      context.commit('SET_TACTIC', payload)
    },
    [TacticAction.TOGGLE_PIN_TACTIC] (context: TacticActionContext, payload: Tactic) {
      context.commit('TOGGLE_PIN_TACTIC', payload)
    },
    [TacticAction.UPDATE_TACTIC] (context: TacticActionContext, payload: Tactic) {
      context.commit('UPDATE_TACTIC', payload)
    },
    [TacticAction.DELETE_TACTIC] (context: TacticActionContext, id: string) {
      context.commit('DELETE_TACTIC', id)
    }
  }
}

export default TacticModule
