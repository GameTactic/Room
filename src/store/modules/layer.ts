import { ActionContext, Module } from 'vuex'
import Konva from 'konva'

export enum LayerGetters {
  LAYER = 'layer',
  LAYER_FIND_GROUP = 'layerFindGroup'
}

export enum LayerActions {
  LAYER_ADD = 'layerAdd',
  LAYER_SET = 'layerSet',
  LAYER_DESTROY_GROUP = 'layerDestroyGroup',
  LAYER_DESTROY_CHILDREN = 'layerDestroyChildren',
  LAYER_DESTROY = 'layerDestroy'
}

export enum LayerMutations {
  LAYER_SET = 'LAYER_SET',
  LAYER_ADD = 'LAYER_ADD',
  LAYER_DESTROY = 'LAYER_DESTROY',
  LAYER_DESTROY_CHILDREN = 'layerDestroyChildren',
  LAYER_DESTROY_GROUP = 'layerDestroyGroup'
}

export interface LayerState {
  layer: Konva.Layer;
}

type LayerActionContext = ActionContext<LayerState, {}>;

const LayerModule: Module<LayerState, {}> = {
  namespaced: true,
  state () {
    return {
      layer: new Konva.Layer()
    }
  },
  getters: {
    [LayerGetters.LAYER]: state => state.layer,
    [LayerGetters.LAYER_FIND_GROUP]: state => (groupId: string) => {
      return state.layer.findOne((child: Konva.Group) => child.attrs.id === groupId)
    }
  },
  mutations: {
    [LayerMutations.LAYER_DESTROY_GROUP] (state: LayerState, groupId: number) {
      state.layer.findOne((child: Konva.Group) => {
        if (child.attrs.id === groupId) {
          child.destroy()
        }
      })
    },
    [LayerMutations.LAYER_SET] (state: LayerState, layer: Konva.Layer) {
      state.layer = layer
    },
    [LayerMutations.LAYER_ADD] (state: LayerState, newGroup: Konva.Group) {
      state.layer.add(newGroup)
    },
    [LayerMutations.LAYER_DESTROY] (state: LayerState) {
      state.layer.destroy()
    },
    [LayerMutations.LAYER_DESTROY_CHILDREN] (state: LayerState) {
      state.layer.destroyChildren()
    }
  },
  actions: {
    [LayerActions.LAYER_ADD] (context: LayerActionContext, newGroup: Konva.Group) {
      context.commit(LayerMutations.LAYER_ADD, newGroup)
    },
    [LayerActions.LAYER_SET] (context: LayerActionContext, newLayer: Konva.Layer) {
      context.commit(LayerMutations.LAYER_SET, newLayer)
    },
    [LayerActions.LAYER_DESTROY] (context: LayerActionContext) {
      context.commit(LayerMutations.LAYER_DESTROY)
    },
    [LayerActions.LAYER_DESTROY_CHILDREN] (context: LayerActionContext) {
      context.commit(LayerMutations.LAYER_DESTROY_CHILDREN)
    },
    [LayerActions.LAYER_DESTROY_GROUP] (context: LayerActionContext, groupId) {
      context.commit(LayerMutations.LAYER_DESTROY_GROUP, groupId)
    }
  }
}

export default LayerModule
