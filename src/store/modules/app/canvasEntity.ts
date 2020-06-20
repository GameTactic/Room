import { ActionContext, Module } from 'vuex'
import { CanvasElement, CanvasElementType } from '@/types/Canvas'
import uuid from 'uuid'
import { AppAuthenticationGetters } from '@/store/modules/app/authentication'
import { Namespaces } from '@/store'
import store from '@/main'
import { RootState } from '@/store/types'

export class CanvasEntityClass {
  private readonly canvasElement: CanvasElement
  private readonly hasMoved: boolean
  private readonly modifyData: {}
  constructor () {
    this.canvasElement = {
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
    this.hasMoved = false
    this.modifyData = {}
  }
  getCanvasEntity () {
    return {
      canvasElement: this.canvasElement,
      hasMoved: this.hasMoved,
      modifyData: this.modifyData
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

export interface CanvasEntity {
  canvasElement: CanvasElement;
  hasMoved: boolean;
  modifyData: {};
}

export interface AppCanvasEntityState {
  canvasEntity: CanvasEntity;
}

type AppCanvasEntityActionContext = ActionContext<AppCanvasEntityState, RootState>;

const AppCanvasEntityModule: Module<AppCanvasEntityState, RootState> = {
  namespaced: true,
  state () {
    return {
      canvasEntity: new CanvasEntityClass().getCanvasEntity()
    }
  },
  getters: {
    [AppCanvasEntityGetters.CANVAS_ELEMENT]: (state): CanvasElement => state.canvasEntity.canvasElement,
    [AppCanvasEntityGetters.CANVAS_ENTITY]: (state): CanvasEntity => state.canvasEntity
  },
  mutations: {
    [AppCanvasEntityMutations.SET_CANVAS_ENTITY] (state: AppCanvasEntityState, entity: CanvasEntity) {
      state.canvasEntity = entity
    },
    [AppCanvasEntityMutations.RESET_CANVAS_ENTITY] (state: AppCanvasEntityState, newState: CanvasEntity) {
      state.canvasEntity = newState
    },
    [AppCanvasEntityMutations.SET_CANVAS_ELEMENT] (state: AppCanvasEntityState, canvasElement: CanvasElement) {
      state.canvasEntity.canvasElement = canvasElement
    },
    [AppCanvasEntityMutations.RESET_CANVAS_ELEMENT] (state: AppCanvasEntityState) {
      const canvasEntityClass = new CanvasEntityClass()
      state.canvasEntity.canvasElement = canvasEntityClass.getCanvasEntity().canvasElement
    }
  },
  actions: {
    [AppCanvasEntityActions.SET_CANVAS_ELEMENT] (context: AppCanvasEntityActionContext, canvasElement: CanvasElement) {
      context.commit(AppCanvasEntityMutations.SET_CANVAS_ELEMENT, canvasElement)
    },
    [AppCanvasEntityActions.RESET_CANVAS_ELEMENT] (context: AppCanvasEntityActionContext) {
      context.commit(AppCanvasEntityMutations.RESET_CANVAS_ELEMENT)
    },
    [AppCanvasEntityActions.SET_CANVAS_ENTITY] (context: AppCanvasEntityActionContext, entity: CanvasEntity) {
      context.commit(AppCanvasEntityMutations.SET_CANVAS_ENTITY, entity)
    },
    [AppCanvasEntityActions.RESET_CANVAS_ENTITY] (context: AppCanvasEntityActionContext) {
      const canvasEntityClass = new CanvasEntityClass()
      const newState = canvasEntityClass.getCanvasEntity()
      context.commit(AppCanvasEntityMutations.RESET_CANVAS_ENTITY, newState)
      return newState
    }
  }
}

export default AppCanvasEntityModule
