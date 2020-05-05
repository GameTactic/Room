import { ActionContext, Module } from 'vuex'
import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import { SocketState } from '@/store/modules/socket'
import { ToolState } from '@/store/modules/tools'
import { StageState } from '@/store/modules/stage'
import { ToolInterface } from '@/tools/Tool'

export enum CanvasMutation {
  SET_CANVAS_ELEMENT = 'SET_CANVAS_ELEMENT',
  SET_CANVAS_ELEMENT_HISTORY = 'SET_CANVAS_ELEMENT_HISTORY',
  ADD_CANVAS_ELEMENT = 'ADD_CANVAS_ELEMENT',
  HIDE_CANVAS_ELEMENT = 'HIDE_CANVAS_ELEMENT',
  SHOW_CANVAS_ELEMENT = 'SHOW_CANVAS_ELEMENT',
  ADD_CANVAS_ELEMENT_HISTORY = 'ADD_CANVAS_ELEMENT_HISTORY'
}

export enum CanvasAction {
  SET_CANVAS_ELEMENT = 'setCanvasElement',
  SET_CANVAS_ELEMENT_HISTORY = 'setCanvasElementHistory',
  ADD_CANVAS_ELEMENT = 'addCanvasElement',
  HIDE_CANVAS_ELEMENT = 'hideCanvasElement',
  SHOW_CANVAS_ELEMENT = 'showCanvasElement',
  ADD_CANVAS_ELEMENT_HISTORY = 'addCanvasElementHistory'
}

export interface HideCanvasElementInterface {
  fromSocket: boolean;
  id: string;
}

export enum CanvasGetters {
  CANVAS_ELEMENTS = 'canvasElements',
  CANVAS_ELEMENTS_HISTORY = 'canvasElementsHistory'
}

interface CanvasState {
  canvasElements: CanvasElement[];
  canvasElementsHistory: CanvasElementHistory[];
}

interface RootState extends CanvasElement {
  canvas: CanvasState;
  socket: SocketState;
  tools: ToolState;
  stage: StageState;
}

type CanvasActionContext = ActionContext<CanvasState, RootState>

const CanvasModule: Module<CanvasState, RootState> = {
  namespaced: true,
  state () {
    return {
      canvasElements: [],
      canvasElementsHistory: []
    }
  },
  getters: {
    [CanvasGetters.CANVAS_ELEMENTS]: state => state.canvasElements,
    [CanvasGetters.CANVAS_ELEMENTS_HISTORY]: state => state.canvasElementsHistory
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
      const foundTool: ToolInterface | undefined = payload.tools.tools.find((tool: ToolInterface) => tool.name === payload.tool.name)
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
