<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Action } from 'vuex-class'
import { RoomAction, Game, Locale, GameName, Ship, GameInfo } from '@/store/modules/room'
import { WowsShipsApiResponse, WowsShipInfoApiResponse } from '@/types/Games/Wows'
import axios from 'axios'

@Component({
  name: 'TheApp'
})
export default class TheApp extends Vue {
  @Action(`room/${RoomAction.SET_GAME}`) setGame!: (game: Game) => void
  @Action(`room/${RoomAction.SET_LOCALE}`) setLocale!: (locale: Locale) => void
  async created () {
    this.setGame({ name: GameName['WOWS'], ships: [], gameInfo: undefined })
    this.setLocale(Locale['ENUK'])
    this.setGame(await this.getWowsApiData())
  }

  async getWowsApiData (): Promise<Game> {
    const response: WowsShipsApiResponse = await axios.get('https://api.worldofwarships.eu/wows/encyclopedia/ships/?application_id=d84a218b4fec37003e799f13777bf880')
    const pageTotal = response.data.meta.page_total
    let ships: Ship[] = []
    ships = ships.concat(Object.values(response.data.data))
    if (pageTotal > 1) {
      for (let i = 2; i < pageTotal + 1; i++) {
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
}
</script>
<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height:100vh;
  background-color: $room-background;
  font-size: $app-fontsize;
}
</style>
