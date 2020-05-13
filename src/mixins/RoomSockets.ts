import Vue from 'vue'
import Component from 'vue-class-component'
import { Socket } from 'vue-socket.io-extended'
import { Action, Getter } from 'vuex-class'
import { Prop, Watch } from 'vue-property-decorator'
import { AuthenticationGetters, ExtendedJWT } from '@/store/modules/authentication'
import { SocketActions, SocketRoomEmit, SocketRoomListen } from '@/store/modules/socket'

@Component({
  name: 'RoomSocket'
})
export default class RoomSocket extends Vue {
  @Prop() id!: string
  @Action(`socket/${SocketActions.EMIT}`) emit!: (payload: { data: object; emit: string }) => void
  @Getter(`authentication/${AuthenticationGetters.IS_AUTH}`) isAuth!: boolean
  @Getter(`authentication/${AuthenticationGetters.JWT}`) jwt!: ExtendedJWT
  @Socket()
  connect () {
    this.emit({ data: { roomId: this.id }, emit: SocketRoomEmit.ROOM_JOIN })
  }

  @Socket(SocketRoomListen.ROOM_USER_JOINED)
  onUserJoined (jti: string) {
    // Someone joined the room
  }

  created () {
    this.initialiseSocketIO()
  }

  @Watch('isAuth')
  onPropertyChanged () {
    this.initialiseSocketIO()
  }

  initialiseSocketIO () {
    if (this.isAuth) { // start socket.io with registered user
      this.$socket.client.io.opts.query = { Authorization: this.jwt.encoded } // First set the token.
      this.$socket.client.open() // Then open the socket and use it anywhere else.
    } else { // start socket.io with anonymous user
    }
  }
}
