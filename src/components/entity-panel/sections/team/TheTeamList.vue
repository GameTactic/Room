<template>
  <accordion-item>
    <template v-slot:header>
      Teams
    </template>
    <template v-slot:middleSpace>
      <v-chip-group mandatory light>
        <v-tooltip
          v-for="team in teams"
          top
          :key="team.id"
        >
          <template v-slot:activator="{ on }">
            <v-chip
              v-on="on"
              label
              outlined
              @click.stop="setSelectedTeam(team)"
            >
              <v-icon :color="team.color" size="15px">fa-users</v-icon>
            </v-chip>
          </template>
          <span>{{ team.name }}</span>
        </v-tooltip>
      </v-chip-group>
    </template>
    <template v-slot:content>
      <the-entity-list-content />
    </template>
  </accordion-item>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Namespaces } from '@/store'
import { SocketTeamAction, SocketTeamGetters } from '@/store/modules/socket/team'
import { Team } from '@/store/types'
import { Action, Getter } from 'vuex-class'
import AccordionItem from '../AccordionItem.vue'
import TheEntityListContent from '../entity/TheEntityListContent.vue'

@Component({
  name: 'TheTeamList',
  components: {
    TheEntityListContent,
    AccordionItem
  }
})
export default class TheTeamList extends Vue {
  @Getter(`${Namespaces.SOCKET_TEAM}/${SocketTeamGetters.TEAMS}`) teams!: Team[]
  @Getter(`${Namespaces.SOCKET_TEAM}/${SocketTeamGetters.SELECTED_TEAM}`) selectedTeam!: Team
  @Action(`${Namespaces.SOCKET_TEAM}/${SocketTeamAction.SET_SELECTED_TEAM}`) setSelectedTeam!: (team: Team) => void
}
</script>
