import Vue from 'vue'
import Component from 'vue-class-component'
import { Socket } from 'vue-socket.io-extended'
import { namespace } from 'vuex-class'
import { Watch } from 'vue-property-decorator'
import { AppAuthenticationGetters, ExtendedJWT } from '@/store/modules/app/authentication'
import { SocketActions, SocketRoomEmit, SocketRoomListen } from '@/store/modules/socket'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import { Namespaces } from '@/store'
import { SocketUserAction } from '@/store/modules/socket/user'
import { User } from '@/store/types'

const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)
const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
const SocketNamespace = namespace(Namespaces.SOCKET)
const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'RoomSockets'
})
export default class RoomSocket extends Vue {
  @SocketRoom.Getter(SocketRoomGetters.ROOM_ID) roomId!: string
  @AppAuthentication.Getter(AppAuthenticationGetters.IS_AUTH) isAuth!: boolean
  @AppAuthentication.Getter(AppAuthenticationGetters.JWT) jwt!: ExtendedJWT
  @SocketNamespace.Action(SocketActions.EMIT) emit!: (payload: { data: object; emit: string }) => void
  @SocketUser.Action(SocketUserAction.SET_USER) setUser!: (user: User) => void
  @SocketUser.Action(SocketUserAction.DELETE_USER) deleteUser!: (jti: string) => void

  @Socket()
  connect () {
    console.log('connected')
    this.emit({ data: { roomId: this.roomId }, emit: SocketRoomEmit.ROOM_CONNECT })
  }

  @Socket(SocketRoomListen.ROOM_USER_CONNECTED)
  onUserConnected (user: User) {
    // Someone joined the room
    console.log('someoneJoinedRoom', user)
    // another user has joined
    if (user.jti !== this.jwt.jti) {
      console.log('a unique user has joined')
      this.setUser(user)
    }
  }

  @Socket(SocketRoomListen.ROOM_USER_DISCONNECTED)
  onUserDisconnected (jti: string) {
    // Someone joined the room
    console.log('someoneLeftRoom', jti)
    // another user has joined
    if (jti !== this.jwt.jti) {
      console.log('a unique user has left the room')
      this.deleteUser(jti)
    }
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
