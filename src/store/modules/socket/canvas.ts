import { ActionContext, Module } from 'vuex'
import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import { AppToolState } from '@/store/modules/app/tools'
import { Tool } from '@/tools/Tool'
import { Namespaces } from '@/store'
import { RootState } from '@/store/types'

export enum SocketCanvasMutation {
  SET_CANVAS_ELEMENT = 'SET_CANVAS_ELEMENT',
  SET_CANVAS_ELEMENT_HISTORY = 'SET_CANVAS_ELEMENT_HISTORY',
  ADD_CANVAS_ELEMENT = 'ADD_CANVAS_ELEMENT',
  HIDE_CANVAS_ELEMENT = 'HIDE_CANVAS_ELEMENT',
  SHOW_CANVAS_ELEMENT = 'SHOW_CANVAS_ELEMENT',
  ADD_CANVAS_ELEMENT_HISTORY = 'ADD_CANVAS_ELEMENT_HISTORY',
}

export enum SocketCanvasAction {
  SET_CANVAS_ELEMENT = 'setCanvasElement',
  SET_CANVAS_ELEMENT_HISTORY = 'setCanvasElementHistory',
  ADD_CANVAS_ELEMENT = 'addCanvasElement',
  HIDE_CANVAS_ELEMENT = 'hideCanvasElement',
  SHOW_CANVAS_ELEMENT = 'showCanvasElement',
  ADD_CANVAS_ELEMENT_HISTORY = 'addCanvasElementHistory'
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

interface CanvasElementTools extends CanvasElement {
  tools: AppToolState;
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
    [SocketCanvasMutation.ADD_CANVAS_ELEMENT] (state: SocketCanvasState, payload: CanvasElementTools) {
      const foundTool: Tool | undefined = payload.tools.tools.find((tool: Tool) => tool.name === payload.tool.name)
      state.canvasElements.push({ ...payload, tool: { ...payload.tool, renderCanvas: foundTool?.renderCanvas } })
    },
    [SocketCanvasMutation.ADD_CANVAS_ELEMENT_HISTORY] (state: SocketCanvasState, payload: CanvasElementHistory) {
      state.canvasElementsHistory.push({ ...payload })
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
      context.commit('ADD_CANVAS_ELEMENT', { ...payload, tools: context.rootState[Namespaces.APP_TOOLS] })
    },
    [SocketCanvasAction.HIDE_CANVAS_ELEMENT] (context: SocketCanvasActionContext, payload: CanvasElement) {
      context.commit('HIDE_CANVAS_ELEMENT', payload)
    },
    [SocketCanvasAction.SHOW_CANVAS_ELEMENT] (context: SocketCanvasActionContext, payload: CanvasElement) {
      context.commit('SHOW_CANVAS_ELEMENT', payload)
    },
    [SocketCanvasAction.ADD_CANVAS_ELEMENT_HISTORY] (context: SocketCanvasActionContext, payload: CanvasElementHistory) {
      context.commit('ADD_CANVAS_ELEMENT_HISTORY', { ...payload })
    }
  }
}

export default SocketCanvasModule
