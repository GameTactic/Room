import { Module } from 'vuex'

interface SocketState {
  socket: WebSocket;
}

export enum SocketActions {
  SEND_MESSAGE = 'sendMessage',
  SEND_IF_OPEN = 'sendIfOpen'
}

export enum SocketGetters {
  SOCKET = 'socket',
  IS_OPEN = 'isOpen'
}

const SocketModule: Module<SocketState, {}> = {
  namespaced: true,
  state () {
    return {
      socket: new WebSocket('wss://echo.eu.gametactic.eu')
    }
  },
  getters: {
    [SocketGetters.SOCKET]: state => state.socket,
    [SocketGetters.IS_OPEN]: state => state.socket.readyState === WebSocket.OPEN
  },
  actions: {
    [SocketActions.SEND_MESSAGE]: ({ state }) => (message: string) => state.socket.send(message),
    [SocketActions.SEND_IF_OPEN]: ({ getters, dispatch }) => async (message: string) => {
      if (getters.isOpen) {
        await dispatch(SocketActions.SEND_MESSAGE, message)
      }
    }
  }
}

export default SocketModule
