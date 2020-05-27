import { ActionContext, Module } from 'vuex'
import Konva from 'konva'

export enum AppStageGetters {
  STAGE = 'stage',
  STAGE_ZOOM = 'stageZoom',
  STAGE_ZOOM_STEP = 'stageZoomStep',
}

export enum AppStageActions {
  SET_STAGE = 'setStage',
  SET_ZOOM = 'setZoom',
  SET_ZOOM_IN = 'setZoomIn',
  SET_ZOOM_OUT = 'setZoomOut',
  SET_ZOOM_STEP = 'setZoomStep',
  SET_ZOOM_DEFAULT = 'setZoomDefault',
}

export enum AppStageMutations {
  SET_STAGE = 'SET_STAGE',
  SET_ZOOM = 'SET_ZOOM',
  SET_ZOOM_IN = 'SET_ZOOM_IN',
  SET_ZOOM_OUT = 'SET_ZOOM_OUT',
  SET_ZOOM_STEP = 'SET_ZOOM_STEP',
}

export interface AppStageState {
  stage: Konva.Stage | undefined;
  stageZoomMax: number;
  stageZoomMin: number;
  stageZoomStep: number;
  stageZoom: number;
}

type AppStageActionContext = ActionContext<AppStageState, {}>;

const AppStageModule: Module<AppStageState, {}> = {
  namespaced: true,
  state () {
    return {
      stage: undefined,
      stageZoomMax: 300,
      stageZoomMin: 10,
      stageZoomStep: 10,
      stageZoom: 100
    }
  },
  getters: {
    [AppStageGetters.STAGE]: state => state.stage,
    [AppStageGetters.STAGE_ZOOM]: state => state.stageZoom,
    [AppStageGetters.STAGE_ZOOM_STEP]: state => state.stageZoomStep
  },
  mutations: {
    [AppStageMutations.SET_STAGE] (state: AppStageState, stage: Konva.Stage) {
      state.stage = stage
    },
    [AppStageMutations.SET_ZOOM] (state: AppStageState, newValue: number) {
      if (newValue < state.stageZoomMin) {
        state.stageZoom = state.stageZoomMin
      } else {
        state.stageZoom = (newValue > state.stageZoomMax) ? state.stageZoomMax : newValue
      }
    },
    [AppStageMutations.SET_ZOOM_IN] (state: AppStageState) {
      const newValue = state.stageZoom + state.stageZoomStep
      if (newValue < state.stageZoomMin) {
        state.stageZoom = state.stageZoomMin
      } else {
        state.stageZoom = (newValue > state.stageZoomMax) ? state.stageZoomMax : newValue
      }
    },
    [AppStageMutations.SET_ZOOM_OUT] (state: AppStageState) {
      const newValue = state.stageZoom - state.stageZoomStep
      if (newValue < state.stageZoomMin) {
        state.stageZoom = state.stageZoomMin
      } else {
        state.stageZoom = (newValue > state.stageZoomMax) ? state.stageZoomMax : newValue
      }
    },
    [AppStageMutations.SET_ZOOM_STEP] (state: AppStageState, newValue: number) {
      state.stageZoomStep = (newValue > 0) ? newValue : state.stageZoomStep
    }
  },
  actions: {
    [AppStageActions.SET_STAGE] (context: AppStageActionContext, stage: Konva.Stage) {
      context.commit(AppStageMutations.SET_STAGE, stage)
    },
    [AppStageActions.SET_ZOOM_IN] (context: AppStageActionContext) {
      context.commit(AppStageMutations.SET_ZOOM_IN)
    },
    [AppStageActions.SET_ZOOM_OUT] (context: AppStageActionContext) {
      context.commit(AppStageMutations.SET_ZOOM_OUT)
    },
    [AppStageActions.SET_ZOOM] (context: AppStageActionContext, newValue: number) {
      context.commit(AppStageMutations.SET_ZOOM, newValue)
    },
    [AppStageActions.SET_ZOOM_STEP] (context: AppStageActionContext, newValue: number) {
      context.commit(AppStageMutations.SET_ZOOM_STEP, newValue)
    },
    [AppStageActions.SET_ZOOM_DEFAULT] (context: AppStageActionContext) {
      context.commit(AppStageMutations.SET_ZOOM, 100)
    }
  }
}

export default AppStageModule
