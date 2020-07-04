<template>
  <accordion-item>
    <template v-slot:header>
      {{ $t('teams.title') }}
    </template>
    <template v-slot:middleSpace>
      <v-chip-group mandatory light>
        <v-tooltip
          v-for="team in teams"
          :key="team.id"
          top
        >
          <template v-slot:activator="{ on }">
            <v-chip
              v-on="on"
              :color="team.color"
              label
              light
              outlined
              filter
              class="custom-entity-chip"
              filter-icon="fa fa-check"
              @click.stop="setSelectedTeam(team)"
            >
              <v-icon :color="team.color" small>fa-users</v-icon>
            </v-chip>
          </template>
          <span>{{ $t(team.name) }}</span>
        </v-tooltip>
      </v-chip-group>
    </template>
    <template v-slot:content>
      <the-wows-team-list-content v-if="game == Game.WOWS" :game="game" :selectedTeam="selectedTeam" />
      <the-wot-team-list-content v-if="game == Game.WOT" :game="game" :selectedTeam="selectedTeam" />
    </template>
  </accordion-item>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Namespaces } from '@/store'
import { SocketTeamAction, SocketTeamGetters } from '@/store/modules/socket/team'
import { Team, Game } from '@/store/types'
import { namespace } from 'vuex-class'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import TheWowsTeamListContent from './wows/TheTeamListContent.vue'
import TheWotTeamListContent from './wot/TheTeamListContent.vue'
import AccordionItem from '../AccordionItem.vue'

const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
const SocketTeam = namespace(Namespaces.SOCKET_TEAM)

@Component({
  name: 'TheTeamList',
  components: {
    TheWowsTeamListContent,
    TheWotTeamListContent,
    AccordionItem
  }
})
export default class TheTeamList extends Vue {
  @SocketRoom.Getter(SocketRoomGetters.GAME) game!: Game
  @SocketTeam.Getter(SocketTeamGetters.TEAMS) teams!: Team[]
  @SocketTeam.Getter(SocketTeamGetters.SELECTED_TEAM) selectedTeam!: Team | undefined
  @SocketTeam.Action(SocketTeamAction.SET_SELECTED_TEAM) setSelectedTeam!: (team: Team) => void

  Game = Game
}
</script>
<style lang="scss">
.custom-entity-chip .v-chip__filter {
  font-size: 14px;
  color: inherit !important;
  padding-left: 3px;
}
</style>
