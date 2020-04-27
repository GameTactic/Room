import { Module, ActionContext } from 'vuex'

export enum SocketActions {
  EMIT_MESSAGE = 'emitMessage',
  JOIN_ROOM = 'joinRoom'
}

type SocketActionContext = ActionContext<{}, {}>;

const SocketModule: Module<{}, {}> = {
  namespaced: true,
  actions: {
    [SocketActions.EMIT_MESSAGE] (_context: SocketActionContext, message: string) {
      const vm: any = this
      console.log('this', this)
      vm._vm.$socket.client.emit('auth', message)
    },
    [SocketActions.JOIN_ROOM] (_context: SocketActionContext, id: string) {
      const vm: any = this
      console.log('vm._vm.$socket.client.emit', vm._vm.$socket.client.emit)
      vm._vm.$socket.client.emit('join', id)
    }
  }
}

export default SocketModule
