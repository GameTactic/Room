import { Module, ActionContext } from 'vuex'

export interface SocketState {
  socket: WebSocket;
}

export enum SocketActions {
  EMIT_MESSAGE = 'emitMessage',
  JOIN_ROOM = 'joinRoom',
  SEND_MESSAGE = 'send',
  SEND_IF_OPEN = 'sendIfOpen'
}

export enum SocketGetters {
  SOCKET = 'socket',
  IS_OPEN = 'isOpen'
}

type SocketActionContext = ActionContext<{}, {}>;

const SocketModule: Module<SocketState, {}> = {
  namespaced: true,
  state () {
    return {
      socket: new WebSocket(process.env.VUE_APP_MS_SOCK || 'ws://socket.gametactic.eu')
    }
  },
  getters: {
    [SocketGetters.SOCKET]: state => state.socket,
    [SocketGetters.IS_OPEN]: state => state.socket.readyState === WebSocket.OPEN
  },
  actions: {
    [SocketActions.SEND_MESSAGE]: ({ state }) => (message: string) => state.socket.send(message),
    [SocketActions.SEND_IF_OPEN]: async ({ getters, dispatch }, message: string) => {
      if (getters.isOpen) {
        await dispatch(SocketActions.SEND_MESSAGE, message)
      }
    },
    [SocketActions.EMIT_MESSAGE] (_context: SocketActionContext, message: string) {
      // eslint-disable-next-line
      const vm: any = this
      vm._vm.$socket.client.emit('auth', message)
    },
    [SocketActions.JOIN_ROOM] (_context: SocketActionContext, id: string) {
      // eslint-disable-next-line
      const vm: any = this
      vm._vm.$socket.client.emit('join', id)
    }
  }
}

export default SocketModule
