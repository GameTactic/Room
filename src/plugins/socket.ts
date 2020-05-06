import { Store } from 'vuex'
import io from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import * as JsonParser from 'socket.io-json-parser'
import { VueConstructor } from 'vue'
import ConnectOpts = SocketIOClient.ConnectOpts;

const socketOptions: ConnectOpts = {
  autoConnect: false,
  jsonp: true,
  forceJSONP: true,
  parser: JsonParser
} as ConnectOpts
const socket = io('localhost:3000', socketOptions)

export default (store: Store<object>, vue: VueConstructor) => {
  vue.use(VueSocketIOExt, socket, { store })
}
