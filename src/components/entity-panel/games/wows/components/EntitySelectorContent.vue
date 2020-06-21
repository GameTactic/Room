<template>
  <EntitySelector :defaultEntities="defaultsEntities" :entities="entities" label="Search for ships"></EntitySelector>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Api, Entity, Game } from '@/store/types'
import { AppRoomGetters } from '@/store/modules/app/room'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import EntitySelector from '@/components/entity-panel/templates/EntitySelector.vue'
import { Ship, WowsShipDataApi } from '@/types/Games/Wows'

const AppRoom = namespace(Namespaces.APP_ROOM)

@Component({
  name: 'EntitySelectorContent',
  components: {
    EntitySelector
  }
})
export default class EntitySelectorContent extends Vue {
  @AppRoom.Getter(AppRoomGetters.API) api!: Api[];
  colors = {
    AirCarrier: 'red',
    Battleship: 'blue',
    Cruiser: 'orange',
    Destroyer: 'green'
  }

  get entities (): Entity[] {
    const gameShips: Api | undefined = this.api.find((api: Api) => api.name === 'wows.encyclopedia.ships')
    if (gameShips && gameShips.data) {
      return (gameShips.data as WowsShipDataApi).ships.filter((ship: Ship) => !ship.default).map((ship: Ship) => ({
        id: ship.id,
        name: ship.name,
        game: Game.WOWS,
        image: ship.image,
        canvasImage: ship.canvasImage,
        color: this.colors[ship.type]
      }))
    }
    return []
  }

  get defaultsEntities (): Entity[] {
    const gameShips: Api | undefined = this.api.find((api: Api) => api.name === 'wows.encyclopedia.ships')
    if (gameShips && gameShips.data) {
      return (gameShips.data as WowsShipDataApi).ships.filter((ship: Ship) => ship.default).map((ship: Ship) => ({
        id: ship.id,
        name: ship.name,
        game: Game.WOWS,
        image: ship.image,
        canvasImage: ship.canvasImage,
        color: this.colors[ship.type]
      }))
    }
    return []
  }
}
</script>

<style>
.custom-chip-group-wows-search .v-slide-group__wrapper .v-slide-group__content {
  overflow: auto;
  max-height: 200px;
}
.custom-wows-entity-ship-search .v-text-field__details {
  display: none;
}
</style>
