<template>
  <div>
    <v-chip-group
      class="px-2"
      column
    >
      <EntitySelectorItem
        v-for="(entity, i) in defaultEntities"
        :key="i"
        :entity="entity"
      />
    </v-chip-group>
    <v-divider class="px-2"></v-divider>
    <v-text-field
      v-model="search"
      :label="label"
      class="custom-wows-entity-ship-search px-2"
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
        class="px-2 custom-chip-group-wows-search"
        column
      >
        <EntitySelectorItem
          v-for="(entity, i) in getEntities"
          :key="i"
          :entity="entity"
        />
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
  get getEntities (): Entity[] {
    if (!this.search) {
      return this.entities.sort((a: Entity, b: Entity) => a.name > b.name ? 1 : -1)
    } else {
      return this.entities.filter((entity: Entity) => entity.name.includes(this.search)).sort((a: Entity, b: Entity) => a.name > b.name ? 1 : -1)
    }
  }
}
</script>

<style lang="scss">
.custom-chip-group-wows-search .v-slide-group__wrapper .v-slide-group__content {
  overflow: auto;
  max-height: 200px;
  @include custom-scroll-bar;
}
.custom-wows-entity-ship-search .v-text-field__details {
  display: none;
}
</style>
