<template>
  <accordion-item>
    <template v-slot:header>
      Teams
    </template>
    <template v-slot:middleSpace>
      <v-chip-group
        mandatory
        light
        class="custom-chip-group"
      >
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
    <template v-slot:rightBtn>
      <v-btn
        text
        light
        icon
        class="custom-add-button ml-0"
        @click.stop=""
      >
        <v-icon
          color="white"
          size="20px"
        >
          fa-ellipsis-v
        </v-icon>
      </v-btn>
    </template>
    <template v-slot:content>
      <entity-section-content></entity-section-content>
    </template>
  </accordion-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import AccordionItem from '@/components/entity-panel/templates/AccordionItem.vue'
import EntitySectionContent from '@/components/entity-panel/games/wows/components/TeamSectionContent.vue'
import { Namespaces } from '@/store'
import { SocketTeamAction, SocketTeamGetters } from '@/store/modules/socket/team'
import { Team } from '@/store/types'
import { Action, Getter } from 'vuex-class'

@Component({
  name: 'TeamSection.vue',
  components: {
    EntitySectionContent,
    AccordionItem
  }
})
export default class TeamSection extends Vue {
  @Getter(`${Namespaces.SOCKET_TEAM}/${SocketTeamGetters.TEAMS}`) teams!: Team[]
  @Getter(`${Namespaces.SOCKET_TEAM}/${SocketTeamGetters.SELECTED_TEAM}`) selectedTeam!: Team
  @Action(`${Namespaces.SOCKET_TEAM}/${SocketTeamAction.SET_SELECTED_TEAM}`) setSelectedTeam!: (team: Team) => void
}
</script>
