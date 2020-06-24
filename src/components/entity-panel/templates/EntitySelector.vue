<template>
  <div>
    <v-text-field
      v-model="search"
      class="custom-wows-entity-ship-search px-2 py-0"
      :placeholder="label"
      prepend-icon="mdi-magnify"
      clear-icon="mdi-close"
      clearable
    >
    </v-text-field>
    <v-list
      class="py-0"
    >
      <v-virtual-scroll
        v-if="filteredEntities.length > 0"
        :items="filteredEntities"
        class="custom-virtual-scroller"
        item-height="40"
        bench="1"
        height="220"
      >
        <template
          v-slot:default="{ item: entity }"
        >
          <EntitySelectorItem
            :entity="entity"
          />
        </template>
      </v-virtual-scroll>
      <div v-else class="caption custom-no-entities-found">
        <div>No entities found</div>
      </div>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Api, Entity } from '@/store/types'
import { AppRoomGetters } from '@/store/modules/app/room'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import EntitySelectorItem from '@/components/entity-panel/templates/components/EntitySelectorItem.vue'
import { Prop } from 'vue-property-decorator'
import { AppToolGetters } from '@/store/modules/app/tools'
import { Tool } from '@/tools/Tool'

const AppTools = namespace(Namespaces.APP_TOOLS)
const AppRoom = namespace(Namespaces.APP_ROOM)

@Component({
  name: 'EntitySelector',
  components: {
    EntitySelectorItem
  }
})
export default class EntitySelector extends Vue {
  @AppRoom.Getter(AppRoomGetters.API) api!: Api[];
  @AppTools.Getter(AppToolGetters.ENABLED_TOOL) enabledTool!: Tool | undefined
  @Prop() private entities!: Entity[]
  @Prop() private defaultEntities!: Entity[]
  @Prop() private label!: string
  search = ''

  get filteredEntities (): Entity[] {
    if (!this.search) {
      return [ ...this.defaultEntities, ...this.entities.sort((a: Entity, b: Entity) => a.name > b.name ? 1 : -1) ]
    } else {
      const allEntities = [ ...this.defaultEntities, ...this.entities ]
      const searchResult = allEntities.filter((entity: Entity) => entity.name.toLowerCase().search(this.search.toLowerCase()) !== -1)
      return searchResult.sort((a: Entity, b: Entity) => a.name.toLowerCase().search(this.search.toLowerCase()) > b.name.toLowerCase().search(this.search.toLowerCase()) ? 1 : -1)
    }
  }
}
</script>

<style lang="scss">
.custom-virtual-scroller {
  @include custom-scroll-bar;
}
.custom-wows-entity-ship-search .v-text-field__details {
  display: none;
}
.custom-no-entities-found {
  height: 220px;
  position: relative;
  div {
    position: absolute;
    top: 43%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
