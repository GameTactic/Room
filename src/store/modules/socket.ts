import { Module, ActionContext } from 'vuex'
import VueSocketIOExt from 'vue-socket.io-extended'
import JsonParser from 'socket.io-json-parser'
import { RequestCanvasEntity } from '@/types/Canvas'
import ConnectOpts = SocketIOClient.ConnectOpts;

export const socketOptions: ConnectOpts = {
  autoConnect: false,
  jsonp: true,
  forceJSONP: true,
  parser: JsonParser
} as ConnectOpts

export enum SocketActions {
  JOIN_ROOM = 'joinRoom',
  REQUEST_CANVAS_ENTITY = 'requestCanvasEntity'
}

type SocketActionContext = ActionContext<{}, {}>;

const SocketModule: Module<{}, {}> = {
  namespaced: true,
  actions: {
    [SocketActions.REQUEST_CANVAS_ENTITY] (_context: SocketActionContext, message: RequestCanvasEntity) {
      // eslint-disable-next-line
      const vm: any = this
      vm._vm.$socket.client.emit('requestCanvasEntity', message)
    },
    [SocketActions.JOIN_ROOM] (_context: SocketActionContext, id: string) {
      // eslint-disable-next-line
      const vm: any = this
      vm._vm.$socket.client.emit('joinRoom', id)
    }
  }
}

export default SocketModule
