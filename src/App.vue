<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { namespace } from 'vuex-class'
import { AppRoomAction, Locale } from '@/store/modules/app/room'
import { SocketRoomAction, Game, SocketRoomGetters } from '@/store/modules/socket/room'
import { AppAuthenticationActions, AppAuthenticationGetters, ExtendedJWT, JWT_KEY, JWT, AuthenticationResponse } from '@/store/modules/app/authentication'
import { Api } from './store/types'
import { getWowsApiData } from '@/games/wows/api'
import { Namespaces } from '@/store'
import { Watch } from 'vue-property-decorator'
import { verify } from 'jsonwebtoken'
import Axios from 'axios'

const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)
const AppRoom = namespace(Namespaces.APP_ROOM)
const SocketRoom = namespace(Namespaces.SOCKET_ROOM)

@Component({
  name: 'TheApp'
})
export default class TheApp extends Vue {
  @AppAuthentication.Getter(AppAuthenticationGetters.JWT) jwt!: ExtendedJWT
  @AppAuthentication.Getter(AppAuthenticationGetters.IS_AUTH) isAuth!: boolean
  @SocketRoom.Getter(SocketRoomGetters.GAME) game!: Game
  @AppRoom.Action(AppRoomAction.ADD_API) addApi!: (api: Api) => void
  @AppRoom.Action(AppRoomAction.SET_LOCALE) setLocale!: (locale: Locale) => void
  @AppAuthentication.Action(AppAuthenticationActions.AUTHENTICATE) authenticate!: (token: string) => Promise<ExtendedJWT>
  @AppAuthentication.Action(AppAuthenticationActions.LOGOUT) logout!: () => void
  @AppAuthentication.Action(AppAuthenticationActions.STORE_TOKEN) storeToken!: (token: string) => void
  @AppAuthentication.Action(AppAuthenticationActions.REFRESH_TOKEN) refreshToken!: (token: string) => void
  @AppAuthentication.Action(AppAuthenticationActions.LOAD_PROVIDERS) loadProviders!: () => void
  @SocketRoom.Action(SocketRoomAction.SET_GAME) setGame!: (name: string) => void
  @AppAuthentication.Getter(AppAuthenticationGetters.JWT) jwt!: ExtendedJWT

  localToken = localStorage.getItem(JWT_KEY)

  async created () {
    this.setGame(Game['WOWS'])
    this.setLocale(Locale['EN'])
    this.initAuthentication()
  }

  @Watch('isAuth')
  async onPropertyChanged () {
    if (this.isAuth && (!!this.localToken || this.jwt.encoded)) {
      switch (this.game) {
        case Game['WOWS']:
          await getWowsApiData((this.localToken || this.jwt.encoded), this.addApi)
          break
        default: break
      }
    }
  }

  async initAuthentication () {
    this.loadProviders()
    if (this.localToken !== null) {
      const response: AuthenticationResponse = await Axios.get((process.env.VUE_APP_MS_AUTH as string))
      if (response.status !== 200) {
        throw Error(this.$tc('authentication.error.reachServer'))
      }
      const verifiedLocalToken = verify(this.localToken, response.data.publicKey) as JWT
      const localTokenExpiryEpoch: number = verifiedLocalToken.exp
      const localTokenExpiryDate: Date = new Date(0)
      localTokenExpiryDate.setUTCSeconds(verifiedLocalToken.exp)
      const currentDate: Date = new Date()
      const localTokenExpiryRefreshEpoch: number = localTokenExpiryDate.setHours(localTokenExpiryDate.getHours() - Number(process.env.VUE_APP_AUTH_EXPIRY_PERIOD))
      if (this.jwt) {
        // if the token has not expired
        if (localTokenExpiryEpoch < currentDate.getTime()) {
          if (currentDate.getTime() > localTokenExpiryRefreshEpoch) {
            // refresh and store the token
            this.refreshToken(this.localToken)
          }
        } else {
          // token has expired
          this.logout()
        }
      } else {
        this.authenticate(this.localToken)
      }
    // else if the url contains the JWT token use it then store it
    } else if (this.$route?.query?.code) {
      this.authenticate(this.$route.query.code as string)
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  background-color: $room-secondary;
  font-size: $app-fontsize;
}

html, .v-application--wrap {
  overflow: hidden;
}
</style>
