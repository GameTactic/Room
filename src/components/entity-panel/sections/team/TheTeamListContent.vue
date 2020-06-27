<template>
  <v-list v-if="selectedTeam.entities.length > 0">
    <v-text-field
      v-model="search"
      label="Search your ships"
      class="px-4 custom-text-field-wows"
      prepend-icon="fa-search"
      clear-icon="fa-times"
      clearable
      placeholder="Start typing to search"
    />
    <v-list-item-group
      v-for="(entity, i) in entities"
      v-bind:key="i"
    >
      <team-list-item :entity="entity" />
    </v-list-item-group>
  </v-list>
  <v-list v-else>
    <span class="px-2">{{ selectedTeam.name }}</span>
    <v-divider />
    <v-list-item>
      <span class="caption">No entities found</span>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Ship } from '@/types/Games/Wows'
import { SocketTeamGetters } from '@/store/modules/socket/team'
import { Getter } from 'vuex-class'
import { Namespaces } from '@/store'
import { Team } from '@/store/types'
import TeamListItem from './TeamListItem.vue'

@Component({
  name: 'TheTeamListContent',
  components: {
    TeamListItem
  }
})
export default class TheTeamListContent extends Vue {
  @Getter(`${Namespaces.SOCKET_TEAM}/${SocketTeamGetters.SELECTED_TEAM}`) selectedTeam!: Team | undefined
  search = ''

  get entities (): Ship[] {
    if (!this.selectedTeam) {
      return []
    } else {
      const entities = this.selectedTeam.entities as Ship[]
      if (!this.search) {
        return entities
      } else {
        return entities.filter((entity: Ship) => entity.name.includes(this.search))
      }
    }
  }
}
</script>

<style lang="scss">
.custom-text-field-wows .v-text-field__details {
  display: none;
}
</style>
