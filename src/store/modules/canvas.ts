import { ActionContext, Module } from 'vuex'
import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import { ToolState } from '@/store/modules/tools'
import { StageState } from '@/store/modules/stage'
import { Tool } from '@/tools/Tool'

export enum CanvasMutation {
  SET_CANVAS_ELEMENT = 'SET_CANVAS_ELEMENT',
  SET_CANVAS_ELEMENT_HISTORY = 'SET_CANVAS_ELEMENT_HISTORY',
  ADD_CANVAS_ELEMENT = 'ADD_CANVAS_ELEMENT',
  HIDE_CANVAS_ELEMENT = 'HIDE_CANVAS_ELEMENT',
  SHOW_CANVAS_ELEMENT = 'SHOW_CANVAS_ELEMENT',
  ADD_CANVAS_ELEMENT_HISTORY = 'ADD_CANVAS_ELEMENT_HISTORY',
}

export enum CanvasAction {
  SET_CANVAS_ELEMENT = 'setCanvasElement',
  SET_CANVAS_ELEMENT_HISTORY = 'setCanvasElementHistory',
  ADD_CANVAS_ELEMENT = 'addCanvasElement',
  HIDE_CANVAS_ELEMENT = 'hideCanvasElement',
  SHOW_CANVAS_ELEMENT = 'showCanvasElement',
  ADD_CANVAS_ELEMENT_HISTORY = 'addCanvasElementHistory'
}

export enum CanvasGetters {
  CANVAS_ELEMENTS = 'canvasElements',
  CANVAS_ELEMENTS_HISTORY = 'canvasElementsHistory',
  CANVAS_ELEMENT_BY_ID = 'canvasElementById',
  CANVAS_ELEMENT_HISTORY_BY_ID = 'canvasElementHistoryById'
}

interface CanvasState {
  canvasElements: CanvasElement[];
  canvasElementsHistory: CanvasElementHistory[];
}

interface RootState extends CanvasElement {
  canvas: CanvasState;
  tools: ToolState;
  stage: StageState;
}

type CanvasActionContext = ActionContext<CanvasState, RootState>

const CanvasModule: Module<CanvasState, RootState> = {
  namespaced: true,
  state () {
    return {
      canvasElements: [],
      canvasElementsHistory: [],
      isCanvasLoaded: false
    }
  },
  getters: {
    [CanvasGetters.CANVAS_ELEMENTS]: state => state.canvasElements,
    [CanvasGetters.CANVAS_ELEMENTS_HISTORY]: state => state.canvasElementsHistory,
    [CanvasGetters.CANVAS_ELEMENT_BY_ID]: state => (id: string) => state.canvasElements.find(canvasElement => canvasElement.id === id),
    [CanvasGetters.CANVAS_ELEMENT_HISTORY_BY_ID]: state => (id: string) => state.canvasElementsHistory.find(canvasElementHistory => canvasElementHistory.id === id)
  },
  mutations: {
    [CanvasMutation.SET_CANVAS_ELEMENT] (state: CanvasState, payload: CanvasElement[]) {
      state.canvasElements = [...payload]
    },
    [CanvasMutation.SET_CANVAS_ELEMENT_HISTORY] (state: CanvasState, payload: CanvasElementHistory[]) {
      state.canvasElementsHistory = [...payload]
    },
    [CanvasMutation.HIDE_CANVAS_ELEMENT] (state: CanvasState, payload: CanvasElement) {
      const foundElement = state.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === payload.id)
      if (foundElement) {
        foundElement.isVisible = false
      }
    },
    [CanvasMutation.SHOW_CANVAS_ELEMENT] (state: CanvasState, payload: CanvasElement) {
      const foundElement = state.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === payload.id)
      if (foundElement) {
        foundElement.isVisible = true
      }
    },
    [CanvasMutation.ADD_CANVAS_ELEMENT] (state: CanvasState, payload: RootState) {
      const foundTool: Tool | undefined = payload.tools.tools.find((tool: Tool) => tool.name === payload.tool.name)
      state.canvasElements.push({ ...payload, tool: { ...payload.tool, renderCanvas: foundTool?.renderCanvas } })
    },
    [CanvasMutation.ADD_CANVAS_ELEMENT_HISTORY] (state: CanvasState, payload: CanvasElementHistory) {
      state.canvasElementsHistory.push({ ...payload })
    }
  },
  actions: {
    [CanvasAction.SET_CANVAS_ELEMENT] (context: CanvasActionContext, payload: CanvasElement[]) {
      context.commit('SET_CANVAS_ELEMENT', payload)
    },
    [CanvasAction.SET_CANVAS_ELEMENT_HISTORY] (context: CanvasActionContext, payload: CanvasElement[]) {
      context.commit('SET_CANVAS_ELEMENT_HISTORY', payload)
    },
    [CanvasAction.ADD_CANVAS_ELEMENT] (context: CanvasActionContext, payload: CanvasElement) {
      context.commit('ADD_CANVAS_ELEMENT', { ...payload, tools: context.rootState.tools })
    },
    [CanvasAction.HIDE_CANVAS_ELEMENT] (context: CanvasActionContext, payload: CanvasElement) {
      context.commit('HIDE_CANVAS_ELEMENT', payload)
    },
    [CanvasAction.SHOW_CANVAS_ELEMENT] (context: CanvasActionContext, payload: RootState) {
      context.commit('SHOW_CANVAS_ELEMENT', payload)
    },
    [CanvasAction.ADD_CANVAS_ELEMENT_HISTORY] (context: CanvasActionContext, payload: CanvasElementHistory) {
      context.commit('ADD_CANVAS_ELEMENT_HISTORY', { ...payload })
    }
  }
}

export default CanvasModule
