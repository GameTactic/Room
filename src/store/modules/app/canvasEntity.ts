import { ActionContext, Module } from 'vuex'
import { CanvasElement, CanvasElementType } from '@/types/Canvas'
import uuid from 'uuid'
import { AppAuthenticationGetters } from '@/store/modules/app/authentication'
import { Namespaces } from '@/store'
import store from '@/main'

export class CanvasEntity {
  private readonly _canvasElement: CanvasElement
  private readonly _hasMoved: boolean
  private readonly _modifyData: {}
  constructor () {
    this._canvasElement = {
      jti: store?.getters[`${Namespaces.APP_AUTHENTICATION}/${AppAuthenticationGetters.JWT}`].jti || '',
      id: uuid(),
      type: CanvasElementType.UNKNOWN,
      data: {},
      tool: {
        name: '',
        temporary: false
      },
      layerId: Math.random().toString(36), // Do we even need this?
      isVisible: true,
      attrs: {
        position: {
          x: 0,
          y: 0
        },
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        skewY: 0,
        rotation: 0
      }
    }
    this._hasMoved = false
    this._modifyData = {}
  }
  getCanvasEntity () {
    return {
      canvasElement: this._canvasElement,
      hasMoved: this._hasMoved,
      modifyData: this._modifyData
    }
  }
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
  modifyData: {};
}

type AppCanvasEntityActionContext = ActionContext<AppCanvasEntityState, {}>;

const AppCanvasEntityModule: Module<AppCanvasEntityState, {}> = {
  namespaced: true,
  state () {
    return new CanvasEntity().getCanvasEntity()
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
      const canvasEntityClass = new CanvasEntity()
      state.canvasElement = canvasEntityClass.getCanvasEntity().canvasElement
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
      const canvasEntityClass = new CanvasEntity()
      const newState = canvasEntityClass.getCanvasEntity()
      context.commit(AppCanvasEntityMutations.RESET_CANVAS_ENTITY, newState)
      return newState
    }
  }
}

export default AppCanvasEntityModule
