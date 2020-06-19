import AppAuthenticationModule from '@/store/modules/app/authentication'
import AppCanvasEntityModule from '@/store/modules/app/canvasEntity'
import AppLayerModule from '@/store/modules/app/layer'
import AppRoomModule from '@/store/modules/app/room'
import AppStageModule from '@/store/modules/app/stage'
import AppToolModule from '@/store/modules/app/tools'
import SocketCanvasModule from '@/store/modules/socket/canvas'
import SocketModule from '@/store/modules/socket'
import SocketRoomModule from '@/store/modules/socket/room'
import SocketStageModule from '@/store/modules/socket/stage'
import SocketTacticModule from '@/store/modules/socket/tactic'
import SocketUserModule from '@/store/modules/socket/user'
import SocketTeamModule from '@/store/modules/socket/team'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export enum Namespaces {
  APP_AUTHENTICATION = 'appAuthentication',
  APP_CANVAS_ENTITY = 'appCanvasEntity',
  APP_LAYER = 'appLayer',
  APP_ROOM = 'appRoom',
  APP_STAGE = 'appStage',
  APP_TOOLS = 'appTools',
  SOCKET_CANVAS = 'socketCanvas',
  SOCKET = 'socket',
  SOCKET_TEAM = 'socketTeam',
  SOCKET_ROOM = 'socketRoom',
  SOCKET_STAGE = 'socketStage',
  SOCKET_TACTIC = 'socketTactic',
  SOCKET_USER = 'socketUser'
}

// eslint-disable-next-line
export default new Vuex.Store<any>({
  modules: {
    [Namespaces.APP_AUTHENTICATION]: AppAuthenticationModule,
    [Namespaces.APP_CANVAS_ENTITY]: AppCanvasEntityModule,
    [Namespaces.APP_LAYER]: AppLayerModule,
    [Namespaces.APP_ROOM]: AppRoomModule,
    [Namespaces.APP_STAGE]: AppStageModule,
    [Namespaces.APP_TOOLS]: AppToolModule,
    [Namespaces.SOCKET_CANVAS]: SocketCanvasModule,
    [Namespaces.SOCKET]: SocketModule,
    [Namespaces.SOCKET_TEAM]: SocketTeamModule,
    [Namespaces.SOCKET_ROOM]: SocketRoomModule,
    [Namespaces.SOCKET_STAGE]: SocketStageModule,
    [Namespaces.SOCKET_TACTIC]: SocketTacticModule,
    [Namespaces.SOCKET_USER]: SocketUserModule
  }
})
