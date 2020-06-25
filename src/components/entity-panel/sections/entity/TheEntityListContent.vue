<template>
  <div class="custom-the-entity-list-content">
    <v-divider class="px-2"></v-divider>
    <v-text-field
      v-model="search"
      class="custom-wows-entity-ship-search px-2 py-0"
      placeholder="Find your ship"
      dense
      prepend-icon="mdi-magnify"
      clear-icon="mdi-close"
      clearable
    />
    <v-chip-group
      class="custom-default-entities-container"
      column
    >
      <entity-list-item
        v-for="(entity, i) in getDefaultEntities"
        :key="i"
        :entity="entity"
      />
    </v-chip-group>
    <v-lazy
      max-height="200"
      v-if="getEntities.length > 0"
    >
      <v-chip-group
        class="custom-chip-group-wows-search px-1"
        column
      >
        <entity-list-item
          v-for="(entity, i) in getEntities"
          :key="i"
          :entity="entity"
        />
      </v-chip-group>
    </v-lazy>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Api, Entity, Game } from '@/store/types'
import { AppRoomGetters } from '@/store/modules/app/room'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { Ship, WowsShipDataApi } from '@/types/Games/Wows'
import { AppToolGetters } from '@/store/modules/app/tools'
import { Tool } from '@/tools/Tool'
import EntityListItem from './EntityListItem.vue'
import { SocketRoomGetters } from '@/store/modules/socket/room'

const AppRoom = namespace(Namespaces.APP_ROOM)
const AppTools = namespace(Namespaces.APP_TOOLS)
const SocketRoom = namespace(Namespaces.SOCKET_ROOM)

@Component({
  name: 'TheEntityListContent',
  components: {
    EntityListItem
  }
})
export default class TheEntityListContent extends Vue {
  @AppRoom.Getter(AppRoomGetters.API) api!: Api[];
  @AppTools.Getter(AppToolGetters.ENABLED_TOOL) enabledTool!: Tool | undefined
  @SocketRoom.Getter(SocketRoomGetters.GAME) game!: Game

  search = ''
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

  get getEntities (): Entity[] {
    if (!this.search) {
      return []
    } else {
      return this.entities.filter((entity: Entity) => entity.name.includes(this.search)).sort((a: Entity, b: Entity) => a.name > b.name ? 1 : -1)
    }
  }

  get getDefaultEntities (): Entity[] {
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
<style lang="scss" scoped>
.custom-the-entity-list-content {
  min-height: 120px;
}
</style>
<style lang="scss">
.custom-chip-group-wows-search .v-slide-group__wrapper .v-slide-group__content {
  overflow: auto;
  max-height: 200px;
  justify-content: space-around;
  @include custom-scroll-bar;
}

.custom-default-entities-container .v-slide-group__content {
  justify-content: center;
}

.custom-wows-entity-ship-search .v-text-field__details {
  display: none;
}
</style>
