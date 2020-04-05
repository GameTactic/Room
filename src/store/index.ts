import Vue from 'vue'
import Vuex from 'vuex'
import ToolModule from '@/store/modules/tools'
import CursorModule from '@/store/modules/cursor'
import SocketModule from '@/store/modules/socket'
import CanvasModule from '@/store/modules/canvas'
import StageModule from '@/store/modules/stage'
import RoomModule from '@/store/modules/room'
import AuthenticationModule from '@/store/modules/authentication'

Vue.use(Vuex)

export enum Namespaces {
  TOOLS = 'tools',
  CURSOR = 'cursor',
  SOCKET = 'socket',
  CANVAS = 'canvas',
  ROOM = 'room',
  AUTH = 'authentication',
  STAGE = 'stage'
}

// eslint-disable-next-line
export default new Vuex.Store<any>({
  modules: {
    [Namespaces.TOOLS]: ToolModule,
    [Namespaces.CURSOR]: CursorModule,
    [Namespaces.SOCKET]: SocketModule,
    [Namespaces.CANVAS]: CanvasModule,
    [Namespaces.ROOM]: RoomModule,
    [Namespaces.AUTH]: AuthenticationModule,
    [Namespaces.STAGE]: StageModule
  }
})
