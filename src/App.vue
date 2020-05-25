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
import { AppAuthenticationActions, AppAuthenticationGetters, ExtendedJWT, JWT_KEY } from '@/store/modules/app/authentication'
import { Api } from './store/types'
import { getWowsApiData } from '@/games/wows/api'
import { Namespaces } from '@/store'

const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)
const AppRoom = namespace(Namespaces.APP_ROOM)
const SocketRoom = namespace(Namespaces.SOCKET_ROOM)

@Component({
  name: 'TheApp'
})
export default class TheApp extends Vue {
  @SocketRoom.Action(SocketRoomAction.SET_GAME) setGame!: (name: string) => void
  @AppRoom.Action(AppRoomAction.ADD_API) addApi!: (api: Api) => void
  @AppRoom.Action(AppRoomAction.SET_LOCALE) setLocale!: (locale: Locale) => void
  @SocketRoom.Getter(SocketRoomGetters.GAME) game!: Game
  @AppAuthentication.Action(AppAuthenticationActions.AUTHENTICATE) authenticate!: (token: string) => Promise<ExtendedJWT>
  @AppAuthentication.Action(AppAuthenticationActions.CHECK_TOKEN_EXPIRY) checkTokenExpiry!: () => Promise<boolean>
  @AppAuthentication.Action(AppAuthenticationActions.STORE_TOKEN) storeToken!: (token: string) => void
  @AppAuthentication.Getter(AppAuthenticationGetters.JWT) jwt!: ExtendedJWT

  async created () {
    this.setGame(Game['WOWS'])
    this.setLocale(Locale['EN'])
    this.initAuthentication()
  }

  async initAuthentication () {
    const localToken = localStorage.getItem(JWT_KEY)

    if (this.checkTokenExpiry()) {
      if (this.$route?.query?.code) {
        this.authenticate(this.$route.query.code as string).then(jwt => this.storeToken(jwt.encoded))
      } else if (localToken !== null) {
        this.authenticate(localToken)
      }
      if (localToken) {
        switch (this.game) {
          case Game['WOWS']:
            await getWowsApiData(localToken, this.addApi)
            break
          default: break
        }
      }
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
