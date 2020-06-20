import { ActionContext, Module } from 'vuex'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import { Dimensions } from '@/mixins/StageWatcher'
import { Tactic, Map, RootState } from '@/store/types'
import { AppRoomGetters } from '../app/room'
import { Namespaces } from '@/store'

export enum SocketStageGetters {
  STAGE_CONFIG = 'stageConfig',
  STAGE_MAP_SRC = 'stageMapSrc',
  STAGE_DIMENSIONS = 'stageDimensions',
  STAGE_DIMENSIONS_INITIAL = 'stageDimensionsInitial'
}

export enum SocketStageActions {
  SET_SCALE = 'setScale',
  SET_CONFIG = 'setConfig',
  SET_MAP_SRC = 'setMapSrc',
  SET_MAP_RATIO = 'setMapRatio',
  SET_DIMENSIONS = 'setDimensions',
  SET_CONFIG_ZOOM = 'setConfigZoom',
  SET_STAGE_TACTIC = 'setStageTactic',
  SET_DIMENSIONS_INITIAL = 'setDimensionsInitial'
}

export enum SocketStageMutations {
  SET_CONFIG = 'SET_CONFIG',
  SET_MAP_SRC = 'SET_MAP_SRC',
  SET_MAP_RATIO = 'SET_MAP_RATIO',
  SET_CONFIG_SCALE = 'SET_CONFIG_SCALE',
  SET_CONFIG_DIMENSIONS = 'SET_CONFIG_DIMENSIONS',
  SET_CONFIG_DIMENSIONS_INITIAL = 'SET_CONFIG_DIMENSIONS_INITIAL'
}

export interface SocketStageState {
  stageConfig: CustomStageConfig;
}

interface StageDimensions {
  width: number;
  height: number;
}

type SocketStageActionContext = ActionContext<SocketStageState, RootState>;

const SocketStageModule: Module<SocketStageState, RootState> = {
  namespaced: true,
  state () {
    return {
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
    [SocketStageGetters.STAGE_CONFIG]: (state): CustomStageConfig => state.stageConfig,
    [SocketStageGetters.STAGE_MAP_SRC]: (state): string => state.stageConfig.mapSrc,
    [SocketStageGetters.STAGE_DIMENSIONS]: (state): StageDimensions => ({ width: state.stageConfig.width, height: state.stageConfig.height }),
    [SocketStageGetters.STAGE_DIMENSIONS_INITIAL]: (state): StageDimensions => ({ width: state.stageConfig.initialWidth, height: state.stageConfig.initialHeight })
  },
  mutations: {
    [SocketStageMutations.SET_MAP_RATIO] (state: SocketStageState, ratio: number) {
      state.stageConfig.mapRatio = ratio
    },
    [SocketStageMutations.SET_MAP_SRC] (state: SocketStageState, newMap: string) {
      if (newMap !== '') {
        state.stageConfig.mapSrc = newMap
      }
    },
    [SocketStageMutations.SET_CONFIG_SCALE] (state: SocketStageState, newValue: number) {
      state.stageConfig.scale = { x: newValue, y: newValue }
    },
    [SocketStageMutations.SET_CONFIG] (state: SocketStageState, config: CustomStageConfig) {
      state.stageConfig = config
    },
    [SocketStageMutations.SET_CONFIG_DIMENSIONS] (state: SocketStageState, dimensions: Dimensions) {
      state.stageConfig.width = dimensions.width
      state.stageConfig.height = dimensions.height
    },
    [SocketStageMutations.SET_CONFIG_DIMENSIONS_INITIAL] (state: SocketStageState, dimensions: Dimensions) {
      state.stageConfig.initialWidth = dimensions.width
      state.stageConfig.initialHeight = dimensions.height
    }
  },
  actions: {
    [SocketStageActions.SET_SCALE] (context: SocketStageActionContext, scale: number) {
      context.commit(SocketStageMutations.SET_CONFIG_SCALE, scale)
    },
    [SocketStageActions.SET_CONFIG] (context: SocketStageActionContext, config: CustomStageConfig) {
      context.commit(SocketStageMutations.SET_CONFIG, config)
    },
    [SocketStageActions.SET_DIMENSIONS] (context: SocketStageActionContext, dimensions: Dimensions) {
      if (context.rootGetters[`${Namespaces.APP_ROOM}/${AppRoomGetters.IS_CANVAS_LOADED}`]) {
        context.commit(SocketStageMutations.SET_CONFIG_DIMENSIONS, dimensions)
      }
    },
    [SocketStageActions.SET_MAP_SRC] (context: SocketStageActionContext, map: Map) {
      context.commit(SocketStageMutations.SET_MAP_SRC, map.icon)
      context.commit(SocketStageMutations.SET_CONFIG_DIMENSIONS, { width: map.width, height: map.height })
    },
    [SocketStageActions.SET_CONFIG_ZOOM] (context: SocketStageActionContext, newValues: { width: number; height: number; scale: number }) {
      context.commit(SocketStageMutations.SET_CONFIG_DIMENSIONS, { width: newValues.width, height: newValues.height })
      context.commit(SocketStageMutations.SET_CONFIG_SCALE, newValues.scale)
    },
    [SocketStageActions.SET_DIMENSIONS_INITIAL] (context: SocketStageActionContext, newValues: Dimensions) {
      context.commit(SocketStageMutations.SET_CONFIG_DIMENSIONS_INITIAL, newValues)
    },
    [SocketStageActions.SET_STAGE_TACTIC] (context: SocketStageActionContext, tactic: Tactic) {
      context.commit(SocketStageMutations.SET_MAP_SRC, tactic.map.icon)
      context.commit(SocketStageMutations.SET_MAP_RATIO, tactic.map.ratio)
      context.commit(SocketStageMutations.SET_CONFIG_DIMENSIONS, { width: tactic.map.width, height: tactic.map.height })
      context.commit(SocketStageMutations.SET_CONFIG_DIMENSIONS_INITIAL, { width: 0, height: 0 })
    }
  }
}

export default SocketStageModule
