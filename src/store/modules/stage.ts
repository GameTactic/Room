import { ActionContext, Module } from 'vuex'
import { CustomStageConfig } from '@/util/PointerEventMapper'

export enum StageGetters {
  STAGE_ZOOM = 'stageZoom',
  STAGE_CONFIG = 'stageConfig',
  STAGE_ZOOM_STEP = 'stageZoomStep'
}

export enum StageActions {
  ZOOM_IN = 'zoomIn',
  ZOOM_OUT = 'zoomOut',
  ZOOM_DEFAULT = 'zoomDefault',
  SCALE = 'scale',
  SET_DIMENSIONS = 'setDimensions',
  SET_CONFIG = 'setConfig',
  SET_ZOOM = 'setZoom',
  SET_ZOOM_STEP = 'setZoomStep'
}

export enum StageMutations {
  SET_ZOOM = 'SET_ZOOM',
  SET_ZOOM_IN = 'SET_ZOOM_IN',
  SET_ZOOM_OUT = 'SET_ZOOM_OUT',
  SET_CONFIG = 'SET_CONFIG',
  SET_CONFIG_SCALE = 'SET_CONFIG_SCALE',
  SET_CONFIG_DIMENSIONS = 'SET_CONFIG_DIMENSIONS',
  SET_ZOOM_STEP = 'SET_ZOOM_STEP'
}

export interface StageState {
  stageZoomMax: number;
  stageZoomMin: number;
  stageZoomStep: number;
  stageZoom: number;
  stageConfig: CustomStageConfig;
}

type StageActionContext = ActionContext<StageState, {}>;

const StageModule: Module<StageState, {}> = {
  namespaced: true,
  state () {
    return {
      stageZoomMax: 300,
      stageZoomMin: 10,
      stageZoomStep: 10,
      stageZoom: 100,
      stageConfig: {
        width: 0,
        height: 0,
        initialWidth: 0,
        initialHeight: 0,
        scale: {
          x: 1,
          y: 1
        }
      }
    }
  },
  getters: {
    [StageGetters.STAGE_ZOOM]: state => state.stageZoom,
    [StageGetters.STAGE_CONFIG]: state => state.stageConfig,
    [StageGetters.STAGE_ZOOM_STEP]: state => state.stageZoomStep
  },
  mutations: {
    [StageMutations.SET_ZOOM] (state: StageState, newValue: number) {
      if (newValue < state.stageZoomMin) {
        state.stageZoom = state.stageZoomMin
        state.stageConfig.scale = {
          x: (state.stageZoom / 100),
          y: (state.stageZoom / 100)
        }
      } else if (newValue > state.stageZoomMax) {
        state.stageZoom = state.stageZoomMax
        state.stageConfig.scale = {
          x: (state.stageZoom / 100),
          y: (state.stageZoom / 100)
        }
      } else {
        state.stageZoom = newValue
        state.stageConfig.scale = {
          x: (state.stageZoom / 100),
          y: (state.stageZoom / 100)
        }
      }
    },
    [StageMutations.SET_ZOOM_IN] (state: StageState) {
      const newValue = state.stageZoom + state.stageZoomStep
      if (newValue < state.stageZoomMin) {
        state.stageZoom = state.stageZoomMin
        state.stageConfig.scale = {
          x: (state.stageZoom / 100),
          y: (state.stageZoom / 100)
        }
      } else if (newValue > state.stageZoomMax) {
        state.stageZoom = state.stageZoomMax
        state.stageConfig.scale = {
          x: (state.stageZoom / 100),
          y: (state.stageZoom / 100)
        }
      } else {
        state.stageZoom = newValue
        state.stageConfig.scale = {
          x: (state.stageZoom / 100),
          y: (state.stageZoom / 100)
        }
      }
    },
    [StageMutations.SET_ZOOM_OUT] (state: StageState) {
      const newValue = state.stageZoom - state.stageZoomStep
      if (newValue < state.stageZoomMin) {
        state.stageZoom = state.stageZoomMin
        state.stageConfig.scale = {
          x: (state.stageZoom / 100),
          y: (state.stageZoom / 100)
        }
      } else if (newValue > state.stageZoomMax) {
        state.stageZoom = state.stageZoomMax
        state.stageConfig.scale = {
          x: (state.stageZoom / 100),
          y: (state.stageZoom / 100)
        }
      } else {
        state.stageZoom = newValue
        state.stageConfig.scale = {
          x: (state.stageZoom / 100),
          y: (state.stageZoom / 100)
        }
      }
    },
    [StageMutations.SET_CONFIG_SCALE] (state: StageState, newValue: number) {
      if (newValue < (state.stageZoomMin) / 100) {
        state.stageConfig.scale = {
          x: (state.stageZoomMin / 100),
          y: (state.stageZoomMin / 100)
        }
      } else if (newValue > (state.stageZoomMax) / 100) {
        state.stageConfig.scale = {
          x: (state.stageZoomMax / 100),
          y: (state.stageZoomMax / 100)
        }
      } else {
        state.stageConfig.scale = {
          x: newValue,
          y: newValue
        }
      }
    },
    [StageMutations.SET_ZOOM_STEP] (state: StageState, newValue: number) {
      state.stageZoomStep = (newValue > 0) ? newValue : state.stageZoomStep
    },
    [StageMutations.SET_CONFIG] (state: StageState, config: CustomStageConfig) {
      state.stageConfig = config
    },
    [StageMutations.SET_CONFIG_DIMENSIONS] (state: StageState, dimensions: { width: number; height: number }) {
      state.stageConfig.width = dimensions.width
      state.stageConfig.height = dimensions.height
    }
  },
  actions: {
    [StageActions.ZOOM_IN] (context: StageActionContext) {
      context.commit(StageMutations.SET_ZOOM_IN)
    },
    [StageActions.ZOOM_OUT] (context: StageActionContext) {
      context.commit(StageMutations.SET_ZOOM_OUT)
    },
    [StageActions.SET_ZOOM] (context: StageActionContext, newValue: number) {
      context.commit(StageMutations.SET_ZOOM, newValue)
    },
    [StageActions.SCALE] (context: StageActionContext, scale: number) {
      context.commit(StageMutations.SET_CONFIG_SCALE, scale)
    },
    [StageActions.SET_CONFIG] (context: StageActionContext, config: CustomStageConfig) {
      context.commit(StageMutations.SET_CONFIG, config)
    },
    [StageActions.SET_DIMENSIONS] (context: StageActionContext, dimensions: { width: number; height: number }) {
      context.commit(StageMutations.SET_CONFIG_DIMENSIONS, dimensions)
    },
    [StageActions.SET_ZOOM_STEP] (context: StageActionContext, newValue: number) {
      context.commit(StageMutations.SET_ZOOM_STEP, newValue)
    },
    [StageActions.ZOOM_DEFAULT] (context: StageActionContext) {
      context.commit(StageMutations.SET_ZOOM, 100)
    }
  }
}

export default StageModule
