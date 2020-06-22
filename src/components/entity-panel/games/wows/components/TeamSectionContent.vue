<template>
  <v-list v-if="selectedTeam.entities.length > 0">
    <span class="px-2">{{ selectedTeam.name }}</span>
    <v-divider />
    <v-text-field
      v-model="search"
      label="Search your ships"
      class="px-4 custom-text-field-wows"
      prepend-icon="mdi-magnify"
      clear-icon="mdi-close"
      clearable
      placeholder="Start typing to search"
    />
    <v-list-item-group
      v-for="(entity, i) in entities"
      v-bind:key="i"
    >
      <TeamSectionItem :entity="entity" />
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
import TeamSectionItem from '@/components/entity-panel/games/wows/components/TeamSectionItem.vue'
import { Ship } from '@/types/Games/Wows'
import { SocketTeamGetters } from '@/store/modules/socket/team'
import { Getter } from 'vuex-class'
import { Namespaces } from '@/store'
import { Team } from '@/store/types'

@Component({
  name: 'TeamSectionContent',
  components: {
    TeamSectionItem
  }
})
export default class TeamSectionContent extends Vue {
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

<style>
.custom-text-field-wows .v-text-field__details {
  display: none;
}
</style>
