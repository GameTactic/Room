import { ActionContext, Module } from 'vuex'
import { CanvasElement } from '@/types/Canvas'
import { Tool } from '@/tools/Tool'
import { CursorState } from './cursor'
import { SocketState } from './socket'
import { ToolState } from './tools'

export enum CanvasMutation {
  SET_CANVAS_ELEMENT = 'SET_CANVAS_ELEMENT',
  ADD_CANVAS_ELEMENT = 'ADD_CANVAS_ELEMENT',
  REMOVE_CANVAS_ELEMENT = 'REMOVE_CANVAS_ELEMENT',
  REDO_CANVAS_ELEMENT = 'REDO_CANVAS_ELEMENT'
}

export enum CanvasAction {
  SET_CANVAS_ELEMENT = 'setCanvasElement',
  ADD_CANVAS_ELEMENT = 'addCanvasElement',
  REMOVE_CANVAS_ELEMENT = 'removeCanvasElement',
  REDO_CANVAS_ELEMENT = 'redoCanvasElement'
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

const CursorModule: Module<CanvasState, {}> = {
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
    [CanvasMutation.ADD_CANVAS_ELEMENT] (state: CanvasState, payload: RootState) {
      payload.jti = 'SAM'
      const foundTool: Tool | undefined = payload.rootState.tools.tools.find((tool: Tool) => tool.name === payload.tool.name)
      state.canvasElements.push({ ...payload, tool: { ...payload.tool, renderCanvas: foundTool?.renderCanvas } })
    },
    [CanvasMutation.REMOVE_CANVAS_ELEMENT] (state: CanvasState, id: string) {
      let foundElementIndex = -1
      const foundElement = state.canvasElements.find((canvasElement: CanvasElement, index: number) => {
        foundElementIndex = index
        return canvasElement.id === id
      })
      if (foundElementIndex && foundElement) {
        state.canvasElementsHistory = state.canvasElementsHistory.concat(foundElement)
        state.canvasElements = state.canvasElements.splice(foundElementIndex, 1)
      }
    },
    [CanvasMutation.REDO_CANVAS_ELEMENT] (state: CanvasState, jti: string) {
      // Reverse the array to find the most recent CanvasElement in the history for a user
      const reverseCanvasElementsHistory = state.canvasElementsHistory.reverse()
      const foundElement = reverseCanvasElementsHistory.find((canvasElement: CanvasElement) => canvasElement.jti === jti)
      if (foundElement) {
        // Find the index of the CanvasElement in the history with the id of the found CanvasElement
        const foundElementIndex = state.canvasElementsHistory.findIndex((canvasElement: CanvasElement) => canvasElement.id === foundElement.id)
        if (foundElementIndex) {
          state.canvasElementsHistory = state.canvasElements.splice(foundElementIndex, 1)
          state.canvasElements = state.canvasElements.concat(foundElement)
        }
      }
    }
  },
  actions: {
    [CanvasAction.SET_CANVAS_ELEMENT] (context: CursorActionContext, payload: CanvasElement[]) {
      context.commit('SET_CANVAS_ELEMENT', payload)
    },
    [CanvasAction.ADD_CANVAS_ELEMENT] (context: CursorActionContext, payload: CanvasElement) {
      context.commit('ADD_CANVAS_ELEMENT', { ...payload, rootState: context.rootState })
    },
    [CanvasAction.REMOVE_CANVAS_ELEMENT] (context: CursorActionContext, id: string) {
      context.commit('REMOVE_CANVAS_ELEMENT', id)
    },
    [CanvasAction.REDO_CANVAS_ELEMENT] (context: CursorActionContext, jti: string) {
      context.commit('REDO_CANVAS_ELEMENT', jti)
    }
  }
}

export default CursorModule
