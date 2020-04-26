<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Action, namespace } from 'vuex-class'
import { Game, GameName, Locale, RoomAction, Ship } from '@/store/modules/room'
import { WowsShipInfoApiResponse, WowsShipsApiResponse } from '@/types/Games/Wows'
import axios from 'axios'
import { Namespaces } from '@/store'
import { AuthenticationActions, ExtendedJWT, JWT_KEY } from '@/store/modules/authentication'

const authNamespace = namespace(Namespaces.AUTH)

@Component({
  name: 'TheApp'
})
export default class TheApp extends Vue {
  @Action(`room/${RoomAction.SET_GAME}`) setGame!: (game: Game) => void
  @Action(`room/${RoomAction.SET_LOCALE}`) setLocale!: (locale: Locale) => void
  @authNamespace.Action(AuthenticationActions.AUTHENTICATE) authenticate!: (token: string) => Promise<ExtendedJWT>
  @authNamespace.Action(AuthenticationActions.STORE_TOKEN) storeToken!: (token: string) => void
  @authNamespace.Action(AuthenticationActions.LOAD_PROVIDERS) loadProviders!: () => void
  async created () {
    this.setGame({ name: GameName['WOWS'], ships: [], gameInfo: undefined })
    this.setLocale(Locale['ENUK'])
    this.setGame(await this.getWowsApiData())
    this.initAuthentication()
  }

  async getWowsApiData (): Promise<Game> {
    const response: WowsShipsApiResponse = await axios.get('https://api.worldofwarships.eu/wows/encyclopedia/ships/?application_id=d84a218b4fec37003e799f13777bf880')
    const pageTotal = response.data.meta.page_total
    let ships: Ship[] = []
    ships = ships.concat(Object.values(response.data.data))
    if (pageTotal > 1) {
      for (let i = 2; i <= pageTotal; i++) {
        const response: WowsShipsApiResponse = await axios.get(`https://api.worldofwarships.eu/wows/encyclopedia/ships/?page_no=${i}&application_id=d84a218b4fec37003e799f13777bf880`)
        ships = ships.concat(Object.values(response.data.data))
      }
    }
    const gameInfo: WowsShipInfoApiResponse = await axios.get('https://api.worldofwarships.eu/wows/encyclopedia/info/?application_id=d84a218b4fec37003e799f13777bf880')

    return {
      name: GameName['WOWS'],
      ships: ships,
      gameInfo: gameInfo.data.data
    }
  }

  initAuthentication () {
    this.loadProviders()
    const localToken = localStorage.getItem(JWT_KEY)
    if (this.$route?.query?.code) {
      this.authenticate(this.$route.query.code as string).then(jwt => this.storeToken(jwt.encoded))
    } else if (localToken !== null) {
      this.authenticate(localToken)
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
