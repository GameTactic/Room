<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Action, namespace, Getter } from 'vuex-class'
import { RoomAction, Locale, GameName, RoomGetters } from '@/store/modules/room'
import { Namespaces } from '@/store'
import { AuthenticationActions, AuthenticationGetters, ExtendedJWT, JWT_KEY } from '@/store/modules/authentication'
import { Api } from './store/modules/types'
import { getWowsApiData } from '@/games/wows/api'

const authNamespace = namespace(Namespaces.AUTH)

@Component({
  name: 'TheApp'
})
export default class TheApp extends Vue {
  @Action(`room/${RoomAction.SET_GAME_NAME}`) setGameName!: (name: string) => void
  @Action(`room/${RoomAction.SET_GAME_API}`) setGameApi!: (api: Api) => void
  @Action(`room/${RoomAction.SET_LOCALE}`) setLocale!: (locale: Locale) => void
  @Getter(`room/${RoomGetters.GAME_NAME}`) game!: GameName
  @authNamespace.Action(AuthenticationActions.AUTHENTICATE) authenticate!: (token: string) => Promise<ExtendedJWT>
  @authNamespace.Action(AuthenticationActions.CHECK_TOKEN_EXPIRY) checkTokenExpiry!: () => Promise<boolean>
  @authNamespace.Action(AuthenticationActions.STORE_TOKEN) storeToken!: (token: string) => void
  @authNamespace.Getter(AuthenticationGetters.JWT) jwt!: ExtendedJWT

  async created () {
    this.setGameName(GameName['WOWS'])
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
          case GameName['WOWS']:
            await getWowsApiData(localToken, this.setGameApi)
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
  height:100vh;
  background-color: $room-secondary;
  font-size: $app-fontsize;
}
html, .v-application--wrap {
  overflow: hidden;
}
</style>
