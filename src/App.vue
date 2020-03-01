<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Action } from 'vuex-class'
import { RoomAction, Game, Locale } from '@/store/modules/room'

@Component({
  name: 'TheApp'
})
export default class TheApp extends Vue {
    @Action(`room/${RoomAction.SET_GAME}`) setGame!: (game: Game) => void
    @Action(`room/${RoomAction.SET_LOCALE}`) setLocale!: (locale: Locale) => void
    created () {
      this.setGame(Game['WOT'])
      this.setLocale(Locale['ENUK'])
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
