import Vue from 'vue'
import Component from 'vue-class-component'
import { Socket } from 'vue-socket.io-extended'
import { namespace } from 'vuex-class'
import { Watch } from 'vue-property-decorator'
import { AppAuthenticationGetters, ExtendedJWT } from '@/store/modules/app/authentication'
import { SocketActions, SocketRoomEmit, SocketRoomListen } from '@/store/modules/socket'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import { Namespaces } from '@/store'

const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)
const SocketNamespace = namespace(Namespaces.SOCKET)

@Component({
  name: 'RoomSockets'
})
export default class RoomSocket extends Vue {
  @SocketRoom.Getter(SocketRoomGetters.ROOM_ID) roomId!: string
  @AppAuthentication.Getter(AppAuthenticationGetters.IS_AUTH) isAuth!: boolean
  @AppAuthentication.Getter(AppAuthenticationGetters.JWT) jwt!: ExtendedJWT
  @SocketNamespace.Action(SocketActions.EMIT) emit!: (payload: { data: object; emit: string }) => void

  @Socket()
  connect () {
    this.emit({ data: { roomId: this.roomId }, emit: SocketRoomEmit.ROOM_JOIN })
  }

  @Socket(SocketRoomListen.ROOM_USER_JOINED)
  onUserJoined () {
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
