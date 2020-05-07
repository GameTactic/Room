import Vue from 'vue'
import Component from 'vue-class-component'
import { Socket } from 'vue-socket.io-extended'
import { Action, Getter } from 'vuex-class'
import { Prop, Watch } from 'vue-property-decorator'
import { AuthenticationGetters, ExtendedJWT } from '@/store/modules/authentication'
import { SocketActions } from '@/store/modules/socket'

@Component({
  name: 'RoomSocket'
})
export default class RoomSocket extends Vue {
  @Prop() id!: string
  @Action(`socket/${SocketActions.JOIN_ROOM}`) joinRoom!: (id: string) => void
  @Getter(`authentication/${AuthenticationGetters.IS_AUTH}`) isAuth!: boolean
  @Getter(`authentication/${AuthenticationGetters.JWT}`) jwt!: ExtendedJWT
  @Socket()
  connect () {
    this.joinRoom(this.id)
  }

  @Socket('userJoined')
  onUserJoined (jti: string) {
    // Someone joined the room
  }

  created () {
    this.initialiseSocketIO(this.isAuth)
  }

  @Watch('isAuth')
  onPropertyChanged (isAuth: boolean) {
    this.initialiseSocketIO(isAuth)
  }

  initialiseSocketIO (isAuth?: boolean) {
    if (isAuth) { // start socket.io with registered user
      this.$socket.client.io.opts.query = { Authorization: this.jwt.encoded } // First set the token.
      this.$socket.client.open() // Then open the socket and use it anywhere else.
    } else { // start socket.io with anonymous user
    }
  }
}
