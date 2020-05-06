import { ActionContext, Module } from 'vuex'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import Konva from 'konva'
import { Dimensions } from '@/mixins/StageWatcher'
import { Tactic, Map } from '@/store/modules/types'

export enum StageGetters {
  STAGE = 'stage',
  STAGE_ZOOM = 'stageZoom',
  STAGE_CONFIG = 'stageConfig',
  STAGE_ZOOM_STEP = 'stageZoomStep',
  STAGE_DIMENSIONS = 'stageDimensions',
  STAGE_DIMENSIONS_INITIAL = 'stageDimensionsInitial'
}

export enum StageActions {
  ZOOM_IN = 'zoomIn',
  ZOOM_OUT = 'zoomOut',
  SET_ZOOM = 'setZoom',
  SET_STAGE = 'setStage',
  SET_SCALE = 'setScale',
  SET_CONFIG = 'setConfig',
  SET_MAP_SRC = 'setMapSrc',
  ZOOM_DEFAULT = 'zoomDefault',
  SET_ZOOM_STEP = 'setZoomStep',
  SET_MAP_RATIO = 'setMapRatio',
  SET_DIMENSIONS = 'setDimensions',
  SET_CONFIG_ZOOM = 'setConfigZoom',
  SET_STAGE_TACTIC = 'setStageTactic',
  SET_DIMENSIONS_INITIAL = 'setDimensionsInitial'
}

export enum StageMutations {
  SET_ZOOM = 'SET_ZOOM',
  SET_STAGE = 'SET_STAGE',
  SET_CONFIG = 'SET_CONFIG',
  SET_ZOOM_IN = 'SET_ZOOM_IN',
  SET_MAP_SRC = 'SET_MAP_SRC',
  SET_ZOOM_OUT = 'SET_ZOOM_OUT',
  SET_ZOOM_STEP = 'SET_ZOOM_STEP',
  SET_MAP_RATIO = 'SET_MAP_RATIO',
  SET_CONFIG_SCALE = 'SET_CONFIG_SCALE',
  SET_CONFIG_DIMENSIONS = 'SET_CONFIG_DIMENSIONS',
  SET_CONFIG_DIMENSIONS_INITIAL = 'SET_CONFIG_DIMENSIONS_INITIAL'
}

export interface StageState {
  stage: Konva.Stage | undefined;
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
      stage: undefined,
      stageZoomMax: 300,
      stageZoomMin: 10,
      stageZoomStep: 10,
      stageZoom: 100,
      stageConfig: {
        width: 1,
        height: 1,
        initialWidth: 0,
        initialHeight: 0,
        mapSrc: '',
        mapRatio: 0,
        scale: {
          x: 1,
          y: 1
        }
      }
    }
  },
  getters: {
    [StageGetters.STAGE]: state => state.stage,
    [StageGetters.STAGE_ZOOM]: state => state.stageZoom,
    [StageGetters.STAGE_CONFIG]: state => state.stageConfig,
    [StageGetters.STAGE_ZOOM_STEP]: state => state.stageZoomStep,
    [StageGetters.STAGE_DIMENSIONS]: state => ({ width: state.stageConfig.width, height: state.stageConfig.height }),
    [StageGetters.STAGE_DIMENSIONS_INITIAL]: state => ({ width: state.stageConfig.initialWidth, height: state.stageConfig.initialHeight })
  },
  mutations: {
    [StageMutations.SET_STAGE] (state: StageState, stage: Konva.Stage) {
      state.stage = stage
    },
    [StageMutations.SET_MAP_RATIO] (state: StageState, ratio: number) {
      state.stageConfig.mapRatio = ratio
    },
    [StageMutations.SET_ZOOM] (state: StageState, newValue: number) {
      if (newValue < state.stageZoomMin) {
        state.stageZoom = state.stageZoomMin
      } else {
        state.stageZoom = (newValue > state.stageZoomMax) ? state.stageZoomMax : newValue
      }
    },
    [StageMutations.SET_MAP_SRC] (state: StageState, newMap: string) {
      if (newMap !== '') {
        state.stageConfig.mapSrc = newMap
      }
    },
    [StageMutations.SET_ZOOM_IN] (state: StageState) {
      const newValue = state.stageZoom + state.stageZoomStep
      if (newValue < state.stageZoomMin) {
        state.stageZoom = state.stageZoomMin
      } else {
        state.stageZoom = (newValue > state.stageZoomMax) ? state.stageZoomMax : newValue
      }
    },
    [StageMutations.SET_ZOOM_OUT] (state: StageState) {
      const newValue = state.stageZoom - state.stageZoomStep
      if (newValue < state.stageZoomMin) {
        state.stageZoom = state.stageZoomMin
      } else {
        state.stageZoom = (newValue > state.stageZoomMax) ? state.stageZoomMax : newValue
      }
    },
    [StageMutations.SET_CONFIG_SCALE] (state: StageState, newValue: number) {
      state.stageConfig.scale = { x: newValue, y: newValue }
    },
    [StageMutations.SET_ZOOM_STEP] (state: StageState, newValue: number) {
      state.stageZoomStep = (newValue > 0) ? newValue : state.stageZoomStep
    },
    [StageMutations.SET_CONFIG] (state: StageState, config: CustomStageConfig) {
      state.stageConfig = config
    },
    [StageMutations.SET_CONFIG_DIMENSIONS] (state: StageState, dimensions: Dimensions) {
      state.stageConfig.width = dimensions.width
      state.stageConfig.height = dimensions.height
    },
    [StageMutations.SET_CONFIG_DIMENSIONS_INITIAL] (state: StageState, dimensions: Dimensions) {
      state.stageConfig.initialWidth = dimensions.width
      state.stageConfig.initialHeight = dimensions.height
    }
  },
  actions: {
    [StageActions.SET_STAGE] (context: StageActionContext, stage: Konva.Stage) {
      context.commit(StageMutations.SET_STAGE, stage)
    },
    [StageActions.ZOOM_IN] (context: StageActionContext) {
      context.commit(StageMutations.SET_ZOOM_IN)
    },
    [StageActions.ZOOM_OUT] (context: StageActionContext) {
      context.commit(StageMutations.SET_ZOOM_OUT)
    },
    [StageActions.SET_ZOOM] (context: StageActionContext, newValue: number) {
      context.commit(StageMutations.SET_ZOOM, newValue)
    },
    [StageActions.SET_SCALE] (context: StageActionContext, scale: number) {
      context.commit(StageMutations.SET_CONFIG_SCALE, scale)
    },
    [StageActions.SET_CONFIG] (context: StageActionContext, config: CustomStageConfig) {
      context.commit(StageMutations.SET_CONFIG, config)
    },
    [StageActions.SET_DIMENSIONS] (context: StageActionContext, dimensions: Dimensions) {
      context.commit(StageMutations.SET_CONFIG_DIMENSIONS, dimensions)
    },
    [StageActions.SET_ZOOM_STEP] (context: StageActionContext, newValue: number) {
      context.commit(StageMutations.SET_ZOOM_STEP, newValue)
    },
    [StageActions.ZOOM_DEFAULT] (context: StageActionContext) {
      context.commit(StageMutations.SET_ZOOM, 100)
    },
    [StageActions.SET_MAP_SRC] (context: StageActionContext, map: Map) {
      context.commit(StageMutations.SET_MAP_SRC, map.icon)
      context.commit(StageMutations.SET_CONFIG_DIMENSIONS, { width: map.width, height: map.height })
    },
    [StageActions.SET_CONFIG_ZOOM] (context: StageActionContext, newValues: { width: number; height: number; scale: number }) {
      context.commit(StageMutations.SET_CONFIG_DIMENSIONS, { width: newValues.width, height: newValues.height })
      context.commit(StageMutations.SET_CONFIG_SCALE, newValues.scale)
    },
    [StageActions.SET_DIMENSIONS_INITIAL] (context: StageActionContext, newValues: Dimensions) {
      context.commit(StageMutations.SET_CONFIG_DIMENSIONS_INITIAL, newValues)
    },
    [StageActions.SET_STAGE_TACTIC] (context: StageActionContext, tactic: Tactic) {
      context.commit(StageMutations.SET_ZOOM, 100)
      context.commit(StageMutations.SET_MAP_SRC, tactic.map.icon)
      context.commit(StageMutations.SET_CONFIG_DIMENSIONS, { width: tactic.map.width, height: tactic.map.height })
      context.commit(StageMutations.SET_CONFIG_DIMENSIONS_INITIAL, { width: 0, height: 0 })
    }
  }
}

export default StageModule
