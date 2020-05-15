import AuthenticationModule from '@/store/modules/authentication'
import CanvasEntityModule from '@/store/modules/canvasEntity'
import CanvasModule from '@/store/modules/canvas'
import SocketModule from '@/store/modules/socket'
import StageModule from '@/store/modules/stage'
import LayerModule from '@/store/modules/layer'
import ToolModule from '@/store/modules/tools'
import RoomModule from '@/store/modules/room'
import TacticModule from '@/store/modules/tactic'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export enum Namespaces {
  CANVAS_ENTITY = 'canvasEntity',
  AUTH = 'authentication',
  CANVAS = 'canvas',
  SOCKET = 'socket',
  STAGE = 'stage',
  TOOLS = 'tools',
  LAYER = 'layer',
  ROOM = 'room',
  TACTIC = 'tactic'
}

// eslint-disable-next-line
export default new Vuex.Store<any>({
  modules: {
    [Namespaces.CANVAS_ENTITY]: CanvasEntityModule,
    [Namespaces.AUTH]: AuthenticationModule,
    [Namespaces.CANVAS]: CanvasModule,
    [Namespaces.SOCKET]: SocketModule,
    [Namespaces.LAYER]: LayerModule,
    [Namespaces.STAGE]: StageModule,
    [Namespaces.TOOLS]: ToolModule,
    [Namespaces.ROOM]: RoomModule,
    [Namespaces.TACTIC]: TacticModule
  }
})
