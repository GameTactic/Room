<template>
  <div>
    <v-chip-group
      class="px-2"
      column
    >
      <EntitySelectorListItem
        v-for="(entity, i) in defaultEntities"
        :key="i"
        :entity="entity"
      ></EntitySelectorListItem>
    </v-chip-group>
    <v-divider class="px-2"></v-divider>
    <v-text-field
      class="custom-wows-entity-ship-search px-2"
      v-model="search"
      :label="label"
      placeholder="Start typing to search"
      prepend-icon="mdi-magnify"
      clear-icon="mdi-close"
      clearable
    >
    </v-text-field>
    <v-lazy
      max-height="200"
      v-if="getEntities.length > 0"
    >
      <v-chip-group
        class="px-2 custom-chip-group-wows-search custom-scroll-bar"
        column
      >
        <EntitySelectorListItem
          v-for="(entity, i) in getEntities"
          :key="i"
          :entity="entity"
        ></EntitySelectorListItem>
      </v-chip-group>
    </v-lazy>
    <span v-else class="caption px-2">No entities found</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Api, Entity } from '@/store/types'
import { AppRoomGetters } from '@/store/modules/app/room'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import EntitySelectorListItem from '@/components/entity-panel/games/wows/components/WowsEntitySelectorListItem.vue'
import { Prop } from 'vue-property-decorator'
import { AppToolGetters } from '@/store/modules/app/tools'
import { Tool } from '@/tools/Tool'

const AppTools = namespace(Namespaces.APP_TOOLS)
const AppRoom = namespace(Namespaces.APP_ROOM)

@Component({
  name: 'EntitySelector',
  components: {
    EntitySelectorListItem
  }
})
export default class EntitySelector extends Vue {
  @AppRoom.Getter(AppRoomGetters.API) api!: Api[];
  @AppTools.Getter(AppToolGetters.ENABLED_TOOL) enabledTool!: Tool | undefined
  @Prop() private entities!: Entity[]
  @Prop() private defaultEntities!: Entity[]
  @Prop() private label!: string
  search = ''
  get getEntities (): Entity[] {
    if (!this.search) {
      return this.entities.sort((a: Entity, b: Entity) => a.name > b.name ? 1 : -1)
    } else {
      return this.entities.filter((entity: Entity) => entity.name.includes(this.search)).sort((a: Entity, b: Entity) => a.name > b.name ? 1 : -1)
    }
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
