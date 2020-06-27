<template>
  <accordion-item>
    <template v-slot:header>
      {{ $t('teams.title') }}
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
              :color="team.color"
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
      <the-wows-entity-list-content v-if="game.WOWS" :game="game" />
      <the-wot-entity-list-content v-if="game.WOT" :game="game" />
    </template>
  </accordion-item>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Namespaces } from '@/store'
import { SocketTeamAction, SocketTeamGetters } from '@/store/modules/socket/team'
import { Team, Game } from '@/store/types'
import { Action, Getter, namespace } from 'vuex-class'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import TheWowsEntityListContent from '../entity/wows/TheEntityListContent.vue'
import TheWotEntityListContent from '../entity/wot/TheEntityListContent.vue'
import AccordionItem from '../AccordionItem.vue'

const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
@Component({
  name: 'TheTeamList',
  components: {
    TheWowsEntityListContent,
    TheWotEntityListContent,
    AccordionItem
  }
})
export default class TheTeamList extends Vue {
  @Getter(`${Namespaces.SOCKET_TEAM}/${SocketTeamGetters.TEAMS}`) teams!: Team[]
  @Getter(`${Namespaces.SOCKET_TEAM}/${SocketTeamGetters.SELECTED_TEAM}`) selectedTeam!: Team
  @Action(`${Namespaces.SOCKET_TEAM}/${SocketTeamAction.SET_SELECTED_TEAM}`) setSelectedTeam!: (team: Team) => void
  @SocketRoom.Getter(SocketRoomGetters.GAME) game!: Game
}
</script>
<style lang="scss">
.custom-entity-chip .v-chip__filter {
  font-size: 14px;
  color: inherit !important;
  padding-left: 3px;
}
</style>
