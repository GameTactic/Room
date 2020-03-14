import { ActionContext, Module } from 'vuex'
import { CanvasElement } from '@/types/Canvas'
import { Tool, Tracker } from '@/tools/Tool'
import { CursorState } from './cursor'
import { SocketState } from './socket'
import { ToolState } from './tools'

export enum CanvasMutation {
  SET_CANVAS_ELEMENT = 'SET_CANVAS_ELEMENT',
  ADD_CANVAS_ELEMENT = 'ADD_CANVAS_ELEMENT',
  HIDE_CANVAS_ELEMENT = 'HIDE_CANVAS_ELEMENT',
  ADD_CANVAS_ELEMENT_HISTORY = 'ADD_CANVAS_ELEMENT_HISTORY',
}

export enum CanvasAction {
  SET_CANVAS_ELEMENT = 'setCanvasElement',
  ADD_CANVAS_ELEMENT = 'addCanvasElement',
  HIDE_CANVAS_ELEMENT = 'hideCanvasElement',
  ADD_CANVAS_ELEMENT_HISTORY = 'addCanvasElementHistory'
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
  rootState: {
    canvas: CanvasState;
    cursor: CursorState;
    socket: SocketState;
    tools: ToolState;
  };
}

type CursorActionContext = ActionContext<CanvasState, {}>

const CanvasModule: Module<CanvasState, {}> = {
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
    [CanvasMutation.HIDE_CANVAS_ELEMENT] (state: CanvasState, id?: string) {
      if (id) {
        const foundElement = state.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === id)
        if (foundElement) {
          foundElement.tracker = Tracker.REMOVAL
          state.canvasElementsHistory.push({ ...foundElement })
        }
      }
    },
    [CanvasMutation.ADD_CANVAS_ELEMENT] (state: CanvasState, payload: RootState) {
      payload.jti = 'SAM'
      const foundTool: Tool | undefined = payload.rootState.tools.tools.find((tool: Tool) => tool.name === payload.tool.name)
      state.canvasElements.push({ ...payload, tool: { ...payload.tool, renderCanvas: foundTool?.renderCanvas } })
      state.canvasElementsHistory.push({ ...payload })
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
      context.commit('ADD_CANVAS_ELEMENT', { ...payload, rootState: context.rootState })
    },
    [CanvasAction.HIDE_CANVAS_ELEMENT] (context: CursorActionContext, id: string) {
      context.commit('HIDE_CANVAS_ELEMENT', id)
    },
    [CanvasAction.ADD_CANVAS_ELEMENT_HISTORY] (context: CursorActionContext, payload: CanvasElement) {
      context.commit('ADD_CANVAS_ELEMENT_HISTORY', { ...payload })
    }
  }
}

export default CanvasModule
