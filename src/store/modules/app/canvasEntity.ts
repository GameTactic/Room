import { ActionContext, Module } from 'vuex'
import { CanvasElement, CanvasElementType } from '@/types/Canvas'
import uuid from 'uuid'
import { AppAuthenticationGetters } from '@/store/modules/app/authentication'
import { Namespaces } from '@/store'

const defaultAppCanvasEntity: AppCanvasEntityState = {
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

export enum AppCanvasEntityGetters {
  CANVAS_ELEMENT = 'canvasElement',
  CANVAS_ENTITY = 'canvasEntity'
}

export enum AppCanvasEntityActions {
  SET_CANVAS_ENTITY = 'setCanvasEntity',
  RESET_CANVAS_ENTITY = 'resetCanvasEntity',
  SET_CANVAS_ELEMENT = 'setCanvasElement',
  RESET_CANVAS_ELEMENT = 'resetCanvasElement'
}

export enum AppCanvasEntityMutations {
  SET_CANVAS_ENTITY = 'SET_CANVAS_ENTITY',
  RESET_CANVAS_ENTITY = 'RESET_CANVAS_ENTITY',
  SET_CANVAS_ELEMENT = 'SET_CANVAS_ELEMENT',
  RESET_CANVAS_ELEMENT = 'RESET_CANVAS_ELEMENT'
}

export interface AppCanvasEntityState {
  canvasElement: CanvasElement;
  hasMoved: boolean;
  modifyData: {} | undefined;
}

type AppCanvasEntityActionContext = ActionContext<AppCanvasEntityState, {}>;

const AppCanvasEntityModule: Module<AppCanvasEntityState, {}> = {
  namespaced: true,
  state () {
    return defaultAppCanvasEntity
  },
  getters: {
    [AppCanvasEntityGetters.CANVAS_ELEMENT]: state => state.canvasElement,
    [AppCanvasEntityGetters.CANVAS_ENTITY]: state => state
  },
  mutations: {
    [AppCanvasEntityMutations.SET_CANVAS_ENTITY] (state: AppCanvasEntityState, entity: AppCanvasEntityState) {
      state = entity
    },
    [AppCanvasEntityMutations.RESET_CANVAS_ENTITY] (state: AppCanvasEntityState, newState: AppCanvasEntityState) {
      state = newState
    },
    [AppCanvasEntityMutations.SET_CANVAS_ELEMENT] (state: AppCanvasEntityState, canvasElement: CanvasElement) {
      state.canvasElement = canvasElement
    },
    [AppCanvasEntityMutations.RESET_CANVAS_ELEMENT] (state: AppCanvasEntityState) {
      state.canvasElement = defaultAppCanvasEntity.canvasElement
      state.canvasElement.id = uuid()
    }
  },
  actions: {
    [AppCanvasEntityActions.SET_CANVAS_ELEMENT] (context: AppCanvasEntityActionContext, canvasElement: CanvasElement) {
      context.commit(AppCanvasEntityMutations.SET_CANVAS_ELEMENT, canvasElement)
    },
    [AppCanvasEntityActions.RESET_CANVAS_ELEMENT] (context: AppCanvasEntityActionContext) {
      context.commit(AppCanvasEntityMutations.RESET_CANVAS_ELEMENT)
    },
    [AppCanvasEntityActions.SET_CANVAS_ENTITY] (context: AppCanvasEntityActionContext, entity: AppCanvasEntityState) {
      context.commit(AppCanvasEntityMutations.SET_CANVAS_ENTITY, entity)
    },
    [AppCanvasEntityActions.RESET_CANVAS_ENTITY] (context: AppCanvasEntityActionContext) {
      const newState = defaultAppCanvasEntity
      newState.canvasElement.id = uuid()
      newState.canvasElement.jti = (context.rootGetters[`${Namespaces.APP_AUTHENTICATION}/${AppAuthenticationGetters.JWT}`]).jti
      context.commit(AppCanvasEntityMutations.RESET_CANVAS_ENTITY, newState)
    }
  }
}

export default AppCanvasEntityModule
