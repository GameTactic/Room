import { ActionContext, Module } from 'vuex'
import { CanvasElement, CanvasElementType } from '@/types/Canvas'
import uuid from 'uuid'
import { AuthenticationGetters } from '@/store/modules/authentication'

const defaultCanvasEntity: CanvasEntityState = {
  canvasElement: {
    jti: '',
    id: '',
    type: CanvasElementType.SHAPE,
    data: {},
    tool: {
      name: '',
      temporary: false
    },
    layerId: Math.random().toString(36), // TODO: Use some other method. (Do we even need this?)
    isVisible: true,
    position: { x: 0, y: 0 }
  },
  hasMoved: false,
  modifyData: {}
}

export enum CanvasEntityGetters {
  CANVAS_ELEMENT = 'canvasElement',
  CANVAS_ENTITY = 'canvasEntity'
}

export enum CanvasEntityActions {
  SET_CANVAS_ENTITY = 'setCanvasEntity',
  RESET_CANVAS_ENTITY = 'resetCanvasEntity',
  SET_CANVAS_ELEMENT = 'setCanvasElement',
  RESET_CANVAS_ELEMENT = 'resetCanvasElement'
}

export enum CanvasEntityMutations {
  SET_CANVAS_ENTITY = 'SET_CANVAS_ENTITY',
  RESET_CANVAS_ENTITY = 'RESET_CANVAS_ENTITY',
  SET_CANVAS_ELEMENT = 'SET_CANVAS_ELEMENT',
  RESET_CANVAS_ELEMENT = 'RESET_CANVAS_ELEMENT'
}

export interface CanvasEntityState {
  canvasElement: CanvasElement;
  hasMoved: boolean;
  modifyData: {} | undefined;
}

type CanvasEntityActionContext = ActionContext<CanvasEntityState, {}>;

const CanvasEntityModule: Module<CanvasEntityState, {}> = {
  namespaced: true,
  state () {
    return defaultCanvasEntity
  },
  getters: {
    [CanvasEntityGetters.CANVAS_ELEMENT]: state => state.canvasElement,
    [CanvasEntityGetters.CANVAS_ENTITY]: state => state
  },
  mutations: {
    [CanvasEntityMutations.SET_CANVAS_ENTITY] (state: CanvasEntityState, entity: CanvasEntityState) {
      state = entity
    },
    [CanvasEntityMutations.RESET_CANVAS_ENTITY] (state: CanvasEntityState, newState: CanvasEntityState) {
      state = newState
    },
    [CanvasEntityMutations.SET_CANVAS_ELEMENT] (state: CanvasEntityState, canvasElement: CanvasElement) {
      state.canvasElement = canvasElement
    },
    [CanvasEntityMutations.RESET_CANVAS_ELEMENT] (state: CanvasEntityState) {
      state.canvasElement = defaultCanvasEntity.canvasElement
      state.canvasElement.id = uuid()
    }
  },
  actions: {
    [CanvasEntityActions.SET_CANVAS_ELEMENT] (context: CanvasEntityActionContext, canvasElement: CanvasElement) {
      context.commit(CanvasEntityMutations.SET_CANVAS_ELEMENT, canvasElement)
    },
    [CanvasEntityActions.RESET_CANVAS_ELEMENT] (context: CanvasEntityActionContext) {
      context.commit(CanvasEntityMutations.RESET_CANVAS_ELEMENT)
    },
    [CanvasEntityActions.SET_CANVAS_ENTITY] (context: CanvasEntityActionContext, entity: CanvasEntityState) {
      context.commit(CanvasEntityMutations.SET_CANVAS_ENTITY, entity)
    },
    [CanvasEntityActions.RESET_CANVAS_ENTITY] (context: CanvasEntityActionContext) {
      const newState = defaultCanvasEntity
      newState.canvasElement.id = uuid()
      newState.canvasElement.jti = (context.rootGetters[`authentication/${AuthenticationGetters.JWT}`]).jti
      context.commit(CanvasEntityMutations.RESET_CANVAS_ENTITY, newState)
    }
  }
}

export default CanvasEntityModule
