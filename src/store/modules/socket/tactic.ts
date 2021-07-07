import { ActionContext, Module } from 'vuex'
import { v4 as uuid } from 'uuid'
import { Collection, Tactic, RootState, ToggleLockTactic, DuplicateTactic } from '@/store/types'

export enum SocketTacticAction {
  SET_COLLECTIONS = 'setCollections',
  SET_COLLECTION = 'setCollection',
  UPDATE_COLLECTION = 'updateCollection',
  DELETE_COLLECTION = 'deleteCollection',
  SET_TACTICS = 'setSocketTactics',
  ADD_TACTIC = 'addSocketTactic',
  DUPLICATE_TACTIC = 'duplicateTactic',
  TOGGLE_PIN_TACTIC = 'togglePinSocketTactic',
  TOGGLE_LOCK_TACTIC = 'toggleLockTactic',
  UPDATE_TACTIC = 'updateSocketTactic',
  DELETE_TACTIC = 'deleteSocketTactic',
  SET_CURRENT_TACTIC_ID = 'setCurrentTacticID'
}

export enum SocketTacticMutation {
  SET_COLLECTIONS = 'SET_COLLECTIONS',
  SET_COLLECTION = 'SET_COLLECTION',
  UPDATE_COLLECTION = 'UPDATE_COLLECTION',
  DELETE_COLLECTION = 'DELETE_COLLECTION',
  SET_TACTICS = 'SET_TACTICS',
  ADD_TACTIC = 'ADD_TACTIC',
  TOGGLE_PIN_TACTIC = 'TOGGLE_PIN_TACTIC',
  TOGGLE_LOCK_TACTIC = 'TOGGLE_LOCK_TACTIC',
  UPDATE_TACTIC = 'UPDATE_TACTIC',
  DELETE_TACTIC = 'DELETE_TACTIC',
  SET_CURRENT_TACTIC_ID = 'SET_CURRENT_TACTIC_ID'
}

export enum SocketTacticGetters {
  COLLECTIONS = 'collections',
  COLLECTION = 'collection',
  TACTICS = 'tactics',
  TACTIC = 'tactic',
  CURRENT_TACTIC_ID = 'currentTacticId',
  CURRENT_TACTIC = 'currentTactic',
  PINNED_TACTICS = 'pinnedSocketTactics'
}

export interface SocketTacticState {
  collections: Collection[];
  tactics: Tactic[];
  currentTacticId: string | undefined;
}

type SocketTacticActionContext = ActionContext<SocketTacticState, RootState>

const SocketTacticModule: Module<SocketTacticState, RootState> = {
  namespaced: true,
  state () {
    return {
      collections: [],
      tactics: [],
      currentTacticId: undefined
    }
  },
  getters: {
    [SocketTacticGetters.CURRENT_TACTIC_ID]: state => state.currentTacticId,
    [SocketTacticGetters.CURRENT_TACTIC]: state => state.tactics.find((tactic: Tactic) => tactic.id === state.currentTacticId),
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
      payload.isPinned = !payload.isPinned
    },
    [SocketTacticMutation.TOGGLE_LOCK_TACTIC] (state: SocketTacticState, payload: ToggleLockTactic) {
      let foundTacticIndex = -1
      const foundTactic: Tactic | undefined = state.tactics.find((tactic: Tactic, index: number) => {
        if (tactic.id === payload.tacticId) {
          foundTacticIndex = index
          return true
        }
      })
      if (foundTacticIndex > -1 && foundTactic) {
        state.tactics.splice(foundTacticIndex, 1, { ...foundTactic, lockedBy: !foundTactic.lockedBy ? payload.jti : undefined })
      }
    },
    [SocketTacticMutation.ADD_TACTIC] (state: SocketTacticState, payload: Tactic) {
      state.tactics.push(payload)
    },
    [SocketTacticMutation.UPDATE_TACTIC] (state: SocketTacticState, payload: Tactic) {
      state.tactics.splice(state.tactics.findIndex((tactic: Tactic) => tactic.id === payload.id), 1, payload)
    },
    [SocketTacticMutation.DELETE_TACTIC] (state: SocketTacticState, id: string) {
      state.tactics.splice(state.tactics.findIndex((tactic: Tactic) => tactic.id === id), 1)
    },
    [SocketTacticMutation.SET_CURRENT_TACTIC_ID] (state: SocketTacticState, id: string) {
      state.currentTacticId = id
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
    [SocketTacticAction.ADD_TACTIC] (context: SocketTacticActionContext, payload: Tactic) {
      context.commit('ADD_TACTIC', payload)
    },
    [SocketTacticAction.DUPLICATE_TACTIC] (context: SocketTacticActionContext, payload: DuplicateTactic) {
      context.commit('ADD_TACTIC', { ...payload.tactic, createdBy: payload.jti, id: uuid() })
    },
    [SocketTacticAction.TOGGLE_PIN_TACTIC] (context: SocketTacticActionContext, payload: Tactic) {
      context.commit('TOGGLE_PIN_TACTIC', payload)
    },
    [SocketTacticAction.TOGGLE_LOCK_TACTIC] (context: SocketTacticActionContext, payload: ToggleLockTactic) {
      context.commit('TOGGLE_LOCK_TACTIC', payload)
    },
    [SocketTacticAction.UPDATE_TACTIC] (context: SocketTacticActionContext, payload: Tactic) {
      context.commit('UPDATE_TACTIC', payload)
    },
    [SocketTacticAction.DELETE_TACTIC] (context: SocketTacticActionContext, id: string) {
      context.commit('DELETE_TACTIC', id)
    },
    [SocketTacticAction.SET_CURRENT_TACTIC_ID] (context: SocketTacticActionContext, id: string) {
      context.commit('SET_CURRENT_TACTIC_ID', id)
    }
  }
}

export default SocketTacticModule
