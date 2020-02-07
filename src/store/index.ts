import Vue from 'vue'
import Vuex from 'vuex'
import ToolModule from '@/store/modules/tools'
import CursorModule from '@/store/modules/cursor'
import SocketModule from '@/store/modules/socket'

Vue.use(Vuex)

export enum Namespaces {
  TOOLS = 'tools',
  CURSOR = 'cursor',
  SOCKET = 'socket'
}

export default new Vuex.Store<{}>({
  modules: {
    [Namespaces.TOOLS]: ToolModule,
    [Namespaces.CURSOR]: CursorModule,
    [Namespaces.SOCKET]: SocketModule
  }
})
