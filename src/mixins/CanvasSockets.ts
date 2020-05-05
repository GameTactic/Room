import Vue from 'vue'
import Component from 'vue-class-component'
import { Socket } from 'vue-socket.io-extended'
import { Action, Getter } from 'vuex-class'
import { Prop } from 'vue-property-decorator'
import { AuthenticationGetters, ExtendedJWT } from '@/store/modules/authentication'
import { SocketGetters } from '@/store/modules/socket'

@Component({
  name: 'RoomSocket'
})
export default class CanvasSocket extends Vue {
  @Prop() id!: string
  @Getter(`socket/${SocketGetters.SOCKET}`) socket!: WebSocket
  @Action('socket/joinRoom') joinRoom!: (id: string) => void
  @Getter(`authentication/${AuthenticationGetters.IS_AUTH}`) isAuth!: boolean
  @Getter(`authentication/${AuthenticationGetters.JWT}`) jwt!: ExtendedJWT
  @Socket()

  created () {
    // eslint-disable-next-line
    this.socket.onmessage = (data: MessageEvent) => {
      // Will create this when we get the sockets working.
    }
  }
}
