import Vue from 'vue'
import Vuex from 'vuex'
import AuthenticationModule from '@/store/modules/authentication'
import CanvasModule from '@/store/modules/canvas'
import CursorModule from '@/store/modules/cursor'
import RoomModule from '@/store/modules/room'
import SocketModule from '@/store/modules/socket'
import StageModule from '@/store/modules/stage'
import ToolModule from '@/store/modules/tools'

Vue.use(Vuex)

export enum Namespaces {
  AUTH = 'authentication',
  CANVAS = 'canvas',
  CURSOR = 'cursor',
  ROOM = 'room',
  SOCKET = 'socket',
  STAGE = 'stage',
  TOOLS = 'tools'
}

// eslint-disable-next-line
export default new Vuex.Store<any>({
  modules: {
    [Namespaces.AUTH]: AuthenticationModule,
    [Namespaces.CANVAS]: CanvasModule,
    [Namespaces.CURSOR]: CursorModule,
    [Namespaces.ROOM]: RoomModule,
    [Namespaces.SOCKET]: SocketModule,
    [Namespaces.STAGE]: StageModule,
    [Namespaces.TOOLS]: ToolModule
  }
})
