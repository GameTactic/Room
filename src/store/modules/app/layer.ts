import { ActionContext, Module } from 'vuex'
import Konva from 'konva'

export enum AppLayerGetters {
  LAYER = 'layer',
  LAYER_FIND_GROUP = 'layerFindGroup'
}

export enum AppLayerActions {
  LAYER_ADD = 'layerAdd',
  LAYER_SET = 'layerSet',
  LAYER_DESTROY_GROUP = 'layerDestroyGroup',
  LAYER_DESTROY = 'layerDestroy',
  LAYER_CLEAR = 'layerClear'
}

export enum AppLayerMutations {
  LAYER_SET = 'LAYER_SET',
  LAYER_ADD = 'LAYER_ADD',
  LAYER_DESTROY = 'LAYER_DESTROY',
  LAYER_DESTROY_GROUP = 'LAYER_DESTROY_GROUP',
  LAYER_CLEAR = 'LAYER_CLEAR'
}

export interface AppLayerState {
  layer: Konva.Layer;
}

type AppLayerActionContext = ActionContext<AppLayerState, {}>;

const AppLayerModule: Module<AppLayerState, {}> = {
  namespaced: true,
  state () {
    return {
      layer: new Konva.Layer()
    }
  },
  getters: {
    [AppLayerGetters.LAYER]: state => state.layer,
    [AppLayerGetters.LAYER_FIND_GROUP]: state => (groupId: string) => {
      return state.layer.findOne((child: Konva.Group) => child.attrs.id === groupId)
    }
  },
  mutations: {
    [AppLayerMutations.LAYER_DESTROY_GROUP] (state: AppLayerState, groupId: number) {
      state.layer.findOne((child: Konva.Group) => {
        if (child.attrs.id === groupId) {
          child.destroyChildren()
        }
      })
    },
    [AppLayerMutations.LAYER_SET] (state: AppLayerState, layer: Konva.Layer) {
      state.layer = layer
    },
    [AppLayerMutations.LAYER_ADD] (state: AppLayerState, newGroup: Konva.Group) {
      state.layer.add(newGroup)
    },
    [AppLayerMutations.LAYER_DESTROY] (state: AppLayerState) {
      state.layer.destroy()
    },
    [AppLayerMutations.LAYER_CLEAR] (state: AppLayerState) {
      state.layer.destroyChildren()
    }
  },
  actions: {
    [AppLayerActions.LAYER_ADD] (context: AppLayerActionContext, newGroup: Konva.Group) {
      context.commit(AppLayerMutations.LAYER_ADD, newGroup)
    },
    [AppLayerActions.LAYER_SET] (context: AppLayerActionContext, newLayer: Konva.Layer) {
      context.commit(AppLayerMutations.LAYER_SET, newLayer)
    },
    [AppLayerActions.LAYER_DESTROY] (context: AppLayerActionContext) {
      context.commit(AppLayerMutations.LAYER_DESTROY)
    },
    [AppLayerActions.LAYER_DESTROY_GROUP] (context: AppLayerActionContext, groupId) {
      context.commit(AppLayerMutations.LAYER_DESTROY_GROUP, groupId)
    },
    [AppLayerActions.LAYER_CLEAR] (context: AppLayerActionContext) {
      context.commit(AppLayerMutations.LAYER_CLEAR)
    }
  }
}

export default AppLayerModule
