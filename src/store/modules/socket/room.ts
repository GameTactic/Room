import { ActionContext, Module } from 'vuex'
import { PresentationPayload, Presentation, RootState, Game } from '@/store/types'

export enum SocketRoomAction {
  SET_GAME = 'setGame',
  SET_PRESENTATION = 'setPresentation',
  UNSET_PRESENTATION = 'unsetPresentation',
  SET_IS_PRIVATE = 'setIsPrivate',
  SET_ROOM_ID = 'setRoomId'
}

export enum SocketRoomMutation {
  SET_GAME = 'SET_GAME',
  SET_PRESENTATION = 'SET_PRESENTATION',
  UNSET_PRESENTATION = 'UNSET_PRESENTATION',
  SET_IS_PRIVATE = 'SET_IS_PRIVATE',
  SET_ROOM_ID = 'SET_ROOM_ID'
}

export enum SocketRoomGetters {
  GAME = 'game',
  PRESENTATION = 'presentation',
  IS_PRIVATE = 'isPrivate',
  ROOM_ID = 'roomId'
}

export interface SocketRoomState {
  game: Game;
  presentation: Presentation;
  isPrivate: boolean;
  roomId: string | undefined;
}

type SocketRoomActionContext = ActionContext<SocketRoomState, RootState>

const SocketRoomModule: Module<SocketRoomState, RootState> = {
  namespaced: true,
  state () {
    return {
      game: Game['NONE'],
      presentation: {
        enabledBy: undefined,
        tacticId: undefined
      },
      isPrivate: false,
      roomId: undefined
    }
  },
  getters: {
    [SocketRoomGetters.GAME]: (state): Game => state.game,
    [SocketRoomGetters.PRESENTATION]: (state): Presentation => ({
      enabledBy: state.presentation.enabledBy,
      tacticId: state.presentation.tacticId
    }),
    [SocketRoomGetters.IS_PRIVATE]: (state): boolean => state.isPrivate,
    [SocketRoomGetters.ROOM_ID]: (state): string | undefined => state.roomId
  },
  mutations: {
    [SocketRoomMutation.SET_GAME] (state: SocketRoomState, name: Game) {
      state.game = name
    },
    [SocketRoomMutation.SET_PRESENTATION] (state: SocketRoomState, payload: PresentationPayload) {
      state.presentation.enabledBy = payload.enabledBy
      state.presentation.tacticId = payload.tacticId
    },
    [SocketRoomMutation.UNSET_PRESENTATION] (state: SocketRoomState) {
      state.presentation.enabledBy = undefined
      state.presentation.tacticId = undefined
    },
    [SocketRoomMutation.SET_IS_PRIVATE] (state: SocketRoomState, isPrivate: boolean) {
      state.isPrivate = isPrivate
    },
    [SocketRoomMutation.SET_ROOM_ID] (state: SocketRoomState, roomId: string) {
      state.roomId = roomId
    }
  },
  actions: {
    [SocketRoomAction.SET_GAME] (context: SocketRoomActionContext, name: Game) {
      context.commit('SET_GAME', name)
    },
    [SocketRoomAction.SET_PRESENTATION] (context: SocketRoomActionContext, payload: PresentationPayload) {
      context.commit('SET_PRESENTATION', payload)
    },
    [SocketRoomAction.UNSET_PRESENTATION] (context: SocketRoomActionContext) {
      context.commit('SET_PRESENTATION')
    },
    [SocketRoomAction.SET_IS_PRIVATE] (context: SocketRoomActionContext, isPrivate: boolean) {
      context.commit('SET_IS_PRIVATE', isPrivate)
    },
    [SocketRoomAction.SET_ROOM_ID] (context: SocketRoomActionContext, roomId: string) {
      context.commit('SET_ROOM_ID', roomId)
    }
  }
}

export default SocketRoomModule
