<template>
  <div class="custom-the-entity-list-content">
    <v-divider class="px-2"></v-divider>
    <entity-search v-model="search" placeholder="entity.textField.placeholder" :game="game" />
    <v-chip-group
      :value="selectedDefaultEntity || undefined"
      class="custom-default-entities-container"
      column
      @change="defaultEntityChipGroupOnChangeHandler"
    >
      <entity-card
        v-for="(entity, i) in getDefaultEntities"
        :key="i"
        :entity="entity"
      />
    </v-chip-group>
    <v-lazy
      max-height="200"
      v-if="entitySearch.length > 0"
    >
      <v-chip-group
        :value="selectedEntity || undefined"
        class="custom-entities-container px-1"
        column
        @change="entityChipGroupOnChangeHandler"
      >
        <entity-card
          v-for="(entity, i) in entitySearch"
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
import { Ship, EntitiesDataApi } from '@/types/Games/Wows'
import { AppToolGetters } from '@/store/modules/app/tools'
import { Tool } from '@/tools/Tool'
import EntityCard from '../EntityCard.vue'
import { GameApiRoutes } from '@/games/types'
import { Prop } from 'vue-property-decorator'
import EntitySearch from '../EntitySearch.vue'

const AppRoom = namespace(Namespaces.APP_ROOM)
const AppTools = namespace(Namespaces.APP_TOOLS)

@Component({
  name: 'TheEntityListContent',
  components: {
    EntityCard,
    EntitySearch
  }
})
export default class TheEntityListContent extends Vue {
  @Prop() game!: Game
  @AppRoom.Getter(AppRoomGetters.API) api!: Api[];
  @AppTools.Getter(AppToolGetters.ENABLED_TOOL) enabledTool!: Tool | undefined

  search = ''
  selectedDefaultEntity: number| undefined = undefined
  selectedEntity: number | undefined = undefined

  colors = {
    AirCarrier: 'red darken-1',
    Battleship: 'blue darken-1',
    Cruiser: 'purple darken-1',
    Destroyer: 'teal darken-1'
  }

  get entities (): Entity[] {
    const apiData: Api | undefined = this.api.find((api: Api) => api.name === GameApiRoutes[Game.WOWS].entities)
    if (apiData && apiData.data) {
      const entities = (apiData.data as EntitiesDataApi).entities as Ship[]
      return entities.filter((ship: Ship) => !ship.default).map((ship: Ship): Ship => ({
        id: ship.id,
        uuid: ship.uuid,
        name: ship.name,
        title: ship.title,
        game: Game.WOWS,
        image: ship.image,
        tier: ship.tier,
        type: ship.type,
        default: ship.default,
        data: ship.data,
        canvasImage: ship.canvasImage,
        color: ship.color
      }))
    }
    return []
  }

  get entitySearch (): Entity[] {
    if (!this.search) {
      return []
    } else {
      return this.entities.filter((entity: Entity) => entity.name.toLowerCase().includes(this.search.toLowerCase())).sort((a: Entity, b: Entity) => a.name > b.name ? 1 : -1)
    }
  }

  get getDefaultEntities (): Entity[] {
    const apiData: Api | undefined = this.api.find((api: Api) => api.name === GameApiRoutes[Game.WOWS].entities)
    if (apiData && apiData.data) {
      const entities = (apiData.data as EntitiesDataApi).entities as Ship[]
      return entities.filter((ship: Ship) => ship.default).map((ship: Ship): Ship => ({
        id: ship.id,
        uuid: ship.uuid,
        name: ship.name,
        title: ship.title,
        game: Game.WOWS,
        tier: ship.tier,
        type: ship.type,
        default: ship.default,
        data: ship.data,
        image: ship.image,
        canvasImage: ship.canvasImage,
        color: ship.color
      }))
    }
    return []
  }

  defaultEntityChipGroupOnChangeHandler () {
    if (this.selectedEntity !== undefined) {
      this.selectedEntity = undefined
    }
  }

  entityChipGroupOnChangeHandler () {
    if (this.selectedDefaultEntity !== undefined) {
      this.selectedDefaultEntity = undefined
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-the-entity-list-content {
  min-height: 120px;
}
</style>
<style lang="scss">
.custom-entities-container .v-slide-group__wrapper .v-slide-group__content {
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
