import { Module, ActionContext } from 'vuex'
import { RequestCanvasEntity } from '@/types/Canvas'

export enum SocketActions {
  JOIN_ROOM = 'joinRoom',
  REQUEST_CANVAS_ENTITY = 'requestCanvasEntity'
}

type SocketActionContext = ActionContext<{}, {}>;

const SocketModule: Module<{}, {}> = {
  namespaced: true,
  actions: {
    [SocketActions.REQUEST_CANVAS_ENTITY] (_context: SocketActionContext, request: RequestCanvasEntity) {
      // eslint-disable-next-line
      const vm: any = this
      vm._vm.$socket.client.emit('canvasRequestChangeCanvasEntity', request)
    },
    [SocketActions.JOIN_ROOM] (_context: SocketActionContext, roomId: string) {
      // eslint-disable-next-line
      const vm: any = this
      vm._vm.$socket.client.emit('roomJoin', { roomId: roomId })
    }
  }
}

export default SocketModule
