import { ActionContext, Module } from 'vuex'
import { CanvasElement } from '@/types/Canvas'
import { Tool, Tracker } from '@/tools/Tool'
import { CursorState } from './cursor'
import { ToolState } from './tools'
import { StageState } from './stage'

export enum CanvasMutation {
  SET_CANVAS_ELEMENT = 'SET_CANVAS_ELEMENT',
  ADD_CANVAS_ELEMENT = 'ADD_CANVAS_ELEMENT',
  HIDE_CANVAS_ELEMENT = 'HIDE_CANVAS_ELEMENT',
  DELETE_CANVAS_ELEMENT = 'DELETE_CANVAS_ELEMENT',
  ADD_CANVAS_ELEMENT_HISTORY = 'ADD_CANVAS_ELEMENT_HISTORY'
}

export enum CanvasAction {
  SET_CANVAS_ELEMENT = 'setCanvasElement',
  ADD_CANVAS_ELEMENT = 'addCanvasElement',
  HIDE_CANVAS_ELEMENT = 'hideCanvasElement',
  DELETE_CANVAS_ELEMENT = 'deleteCanvasElement',
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
  canvasElementsHistory: CanvasElement[];
}

interface RootState extends CanvasElement {
  canvas: CanvasState;
  cursor: CursorState;
  tools: ToolState;
  stage: StageState;
}

type CursorActionContext = ActionContext<CanvasState, RootState>

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
    [CanvasMutation.HIDE_CANVAS_ELEMENT] (state: CanvasState, payload: HideCanvasElementInterface) {
      if (payload.id) {
        const foundElement = state.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === payload.id)
        if (foundElement) {
          foundElement.tracker = Tracker.REMOVAL
          if (!payload.fromSocket) {
            state.canvasElementsHistory.push({ ...foundElement })
          }
        }
      }
    },
    [CanvasMutation.DELETE_CANVAS_ELEMENT] (state: CanvasState, payload: RootState) {
      if (payload.id) {
        const foundElement = state.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === payload.id)
        if (foundElement) {
          const index = state.canvasElements.indexOf(foundElement)
          state.canvasElements.splice(index, 1)
        }
      }
    },
    [CanvasMutation.ADD_CANVAS_ELEMENT] (state: CanvasState, payload: RootState) {
      payload.jti = 'SAM'
      const foundTool: Tool | undefined = payload.tools.tools.find((tool: Tool) => tool.name === payload.tool.name)
      state.canvasElements.push({ ...payload, tool: { ...payload.tool, renderCanvas: foundTool?.renderCanvas } })
    },
    [CanvasMutation.ADD_CANVAS_ELEMENT_HISTORY] (state: CanvasState, payload: CanvasElement) {
      payload.jti = 'SAM'
      state.canvasElementsHistory.push({ ...payload })
    }
  },
  actions: {
    [CanvasAction.SET_CANVAS_ELEMENT] (context: CursorActionContext, payload: CanvasElement[]) {
      context.commit('SET_CANVAS_ELEMENT', payload)
    },
    [CanvasAction.ADD_CANVAS_ELEMENT] (context: CursorActionContext, payload: CanvasElement) {
      context.commit('ADD_CANVAS_ELEMENT', { ...payload, tools: context.rootState.tools })
    },
    [CanvasAction.HIDE_CANVAS_ELEMENT] (context: CursorActionContext, payload: HideCanvasElementInterface) {
      context.commit('HIDE_CANVAS_ELEMENT', payload)
    },
    [CanvasAction.DELETE_CANVAS_ELEMENT] (context: CursorActionContext, payload: RootState) {
      context.commit('DELETE_CANVAS_ELEMENT', payload)
    },
    [CanvasAction.ADD_CANVAS_ELEMENT_HISTORY] (context: CursorActionContext, payload: CanvasElement) {
      context.commit('ADD_CANVAS_ELEMENT_HISTORY', { ...payload })
    }
  }
}

export default CanvasModule
