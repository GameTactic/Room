import { ActionContext, Module } from 'vuex'
import { CanvasElement, CanvasElementHistory, Point } from '@/types/canvas'
import { RootState } from '@/store/types'
import { Namespaces } from '@/store'
import { SocketTacticAction } from './tactic'

export enum SocketCanvasMutation {
  SET_CANVAS_ELEMENT = 'SET_CANVAS_ELEMENT',
  SET_CANVAS_ELEMENT_HISTORY = 'SET_CANVAS_ELEMENT_HISTORY',
  ADD_CANVAS_ELEMENT = 'ADD_CANVAS_ELEMENT',
  HIDE_CANVAS_ELEMENT = 'HIDE_CANVAS_ELEMENT',
  SHOW_CANVAS_ELEMENT = 'SHOW_CANVAS_ELEMENT',
  ADD_CANVAS_ELEMENT_HISTORY = 'ADD_CANVAS_ELEMENT_HISTORY',
  UPDATE_CANVAS_ELEMENT_ATTRS = 'UPDATE_CANVAS_ELEMENT_ATTRS',
  MOVE_CANVAS_ELEMENT = 'MOVE_CANVAS_ELEMENT'
}

export enum SocketCanvasAction {
  SET_CANVAS_ELEMENT = 'setCanvasElement',
  SET_CANVAS_ELEMENT_HISTORY = 'setCanvasElementHistory',
  ADD_CANVAS_ELEMENT = 'addCanvasElement',
  HIDE_CANVAS_ELEMENT = 'hideCanvasElement',
  SHOW_CANVAS_ELEMENT = 'showCanvasElement',
  ADD_CANVAS_ELEMENT_HISTORY = 'addCanvasElementHistory',
  UPDATE_CANVAS_ELEMENT_ATTRS = 'updateCanvasElementAttrs',
  MOVE_CANVAS_ELEMENT = 'moveCanvasElement'
}

export enum SocketCanvasGetters {
  CANVAS_ELEMENTS = 'canvasElements',
  CANVAS_ELEMENTS_HISTORY = 'canvasElementsHistory',
  CANVAS_ELEMENT_BY_ID = 'canvasElementById',
  CANVAS_ELEMENT_HISTORY_BY_ID = 'canvasElementHistoryById'
}

export interface SocketCanvasState {
  canvasElements: CanvasElement[];
  canvasElementsHistory: CanvasElementHistory[];
}

type SocketCanvasActionContext = ActionContext<SocketCanvasState, RootState>

const SocketCanvasModule: Module<SocketCanvasState, RootState> = {
  namespaced: true,
  state () {
    return {
      canvasElements: [],
      canvasElementsHistory: []
    }
  },
  getters: {
    [SocketCanvasGetters.CANVAS_ELEMENTS]: (state): CanvasElement[] => state.canvasElements,
    [SocketCanvasGetters.CANVAS_ELEMENTS_HISTORY]: (state): CanvasElementHistory[] => state.canvasElementsHistory,
    [SocketCanvasGetters.CANVAS_ELEMENT_BY_ID]: state => (id: string): CanvasElement | undefined => state.canvasElements.find(canvasElement => canvasElement.id === id),
    [SocketCanvasGetters.CANVAS_ELEMENT_HISTORY_BY_ID]: state => (id: string): CanvasElementHistory | undefined => state.canvasElementsHistory.find(canvasElementHistory => canvasElementHistory.id === id)
  },
  mutations: {
    [SocketCanvasMutation.SET_CANVAS_ELEMENT] (state: SocketCanvasState, payload: CanvasElement[]) {
      state.canvasElements = [...payload]
    },
    [SocketCanvasMutation.SET_CANVAS_ELEMENT_HISTORY] (state: SocketCanvasState, payload: CanvasElementHistory[]) {
      state.canvasElementsHistory = [...payload]
    },
    [SocketCanvasMutation.HIDE_CANVAS_ELEMENT] (state: SocketCanvasState, payload: CanvasElement) {
      const foundElement = state.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === payload.id)
      if (foundElement) {
        foundElement.isVisible = false
      }
    },
    [SocketCanvasMutation.SHOW_CANVAS_ELEMENT] (state: SocketCanvasState, payload: CanvasElement) {
      const foundElement = state.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === payload.id)
      if (foundElement) {
        foundElement.isVisible = true
      }
    },
    [SocketCanvasMutation.ADD_CANVAS_ELEMENT] (state: SocketCanvasState, payload: CanvasElement) {
      state.canvasElements.push(payload)
    },
    [SocketCanvasMutation.ADD_CANVAS_ELEMENT_HISTORY] (state: SocketCanvasState, payload: CanvasElementHistory) {
      state.canvasElementsHistory.push({ ...payload })
    },
    [SocketCanvasMutation.UPDATE_CANVAS_ELEMENT_ATTRS] (state: SocketCanvasState, payload: { id: string; attrs: CanvasElement['attrs'] }) {
      const foundElement = state.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === payload.id)
      if (foundElement) {
        foundElement.attrs = { ...payload.attrs }
      }
    },
    [SocketCanvasMutation.MOVE_CANVAS_ELEMENT] (state: SocketCanvasState, payload: { id: string; from: Point; to: Point }) {
      const foundElement = state.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === payload.id)
      if (foundElement) {
        foundElement.attrs.position = {
          x: (payload.to.x - payload.from.x) + foundElement.attrs.position.x,
          y: (payload.to.y - payload.from.y) + foundElement.attrs.position.y
        }
      }
    }
  },
  actions: {
    [SocketCanvasAction.SET_CANVAS_ELEMENT] (context: SocketCanvasActionContext, payload: CanvasElement[]) {
      context.commit('SET_CANVAS_ELEMENT', payload)
    },
    [SocketCanvasAction.SET_CANVAS_ELEMENT_HISTORY] (context: SocketCanvasActionContext, payload: CanvasElement[]) {
      context.commit('SET_CANVAS_ELEMENT_HISTORY', payload)
    },
    [SocketCanvasAction.ADD_CANVAS_ELEMENT] (context: SocketCanvasActionContext, payload: CanvasElement) {
      const canvasElementJSON: CanvasElement = JSON.parse(JSON.stringify({ ...payload }))
      context.dispatch(`${Namespaces.SOCKET_TACTIC}/${SocketTacticAction.ADD_CANVAS_ELEMENT_TO_TACTIC}`, canvasElementJSON, { root: true })
      context.commit('ADD_CANVAS_ELEMENT', canvasElementJSON)
    },
    [SocketCanvasAction.HIDE_CANVAS_ELEMENT] (context: SocketCanvasActionContext, payload: CanvasElement) {
      context.commit('HIDE_CANVAS_ELEMENT', payload)
    },
    [SocketCanvasAction.SHOW_CANVAS_ELEMENT] (context: SocketCanvasActionContext, payload: CanvasElement) {
      context.commit('SHOW_CANVAS_ELEMENT', payload)
    },
    [SocketCanvasAction.ADD_CANVAS_ELEMENT_HISTORY] (context: SocketCanvasActionContext, payload: CanvasElementHistory) {
      const canvasElementHistoryJSON: CanvasElementHistory = JSON.parse(JSON.stringify({ ...payload }))
      context.dispatch(`${Namespaces.SOCKET_TACTIC}/${SocketTacticAction.ADD_CANVAS_ELEMENT_HISTORY_TO_TACTIC}`, canvasElementHistoryJSON, { root: true })
      context.commit('ADD_CANVAS_ELEMENT_HISTORY', canvasElementHistoryJSON)
    },
    [SocketCanvasAction.UPDATE_CANVAS_ELEMENT_ATTRS] (context: SocketCanvasActionContext, payload: { id: string; attrs: CanvasElement['attrs'] }) {
      context.commit('UPDATE_CANVAS_ELEMENT_ATTRS', payload)
    },
    [SocketCanvasAction.MOVE_CANVAS_ELEMENT] (context: SocketCanvasActionContext, payload: { id: string; from: Point; to: Point }) {
      context.commit('MOVE_CANVAS_ELEMENT', payload)
    }
  }
}

export default SocketCanvasModule
