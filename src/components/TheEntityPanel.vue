<template>
  <v-navigation-drawer
    class="custom-navigation-drawer"
    width="300"
    permanent
    right
    absolute
  >
    <v-expansion-panels
      accordion
      flat
      tile
      multiple
      class="custom-expansion-panels"
    >
      <WowsEntitySection v-if="game === Game.WOWS && currentTacticId"></WowsEntitySection>
      <WotEntitySection v-if="game === Game.WOT && currentTacticId"></WotEntitySection>
      <!-- Team section -->
      <WowsTeamSection v-if="game === Game.WOWS && currentTacticId"></WowsTeamSection>
      <WotTeamSection v-if="game === Game.WOT && currentTacticId"></WotTeamSection>
      <!-- End team section -->
      <TacticSelector></TacticSelector>
      <UserList></UserList>
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import WowsTeamSection from '@/components/entity-panel/games/wows/WowsTeamSection.vue'
import TacticSelector from '@/components/entity-panel/sections/TacticSelector.vue'
import UserList from '@/components/entity-panel/sections/UserList.vue'
import WotTeamSection from '@/components/entity-panel/games/wot/WotTeamSection.vue'
import { SocketTeamGetters } from '@/store/modules/socket/team'
import { Team, Game } from '@/store/types'
import { SocketTacticGetters } from '@/store/modules/socket/tactic'
import WowsEntitySection from '@/components/entity-panel/games/wows/WowsEntitySelector.vue'
import WotEntitySection from '@/components/entity-panel/games/wot/WotEntitySelector.vue'
const SocketTeam = namespace(Namespaces.SOCKET_TEAM)
const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)
const SocketRoom = namespace(Namespaces.SOCKET_ROOM)

@Component({
  name: 'TheEntityPanel',
  components: {
    WotEntitySection,
    WowsEntitySection,
    WotTeamSection,
    WowsTeamSection,
    UserList,
    TacticSelector
  }
})
export default class EntityPanel extends Vue {
  @SocketRoom.Getter(SocketRoomGetters.GAME) private readonly game!: Game;
  @SocketTactic.Getter(SocketTacticGetters.CURRENT_TACTIC_ID) private readonly currentTacticId!: string | undefined
  @SocketTeam.Getter(SocketTeamGetters.TEAMS) private readonly teams!: Team[];
  // Enum
  Game = Game
}
</script>
<style scoped lang="scss">
.custom-navigation-drawer {
  background-color: #FFFFFFFF;
  height: calc(100vh - 52px) !important;
  top: 52px !important;
}
</style>
<style lang="scss">
.custom-expansion-panel-header {
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: $room-primary;
}
</style>
