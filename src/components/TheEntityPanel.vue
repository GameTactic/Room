<template>
  <v-navigation-drawer
    class="custom-navigation-drawer"
    width="300"
    temporary
    stateless
    hide-overlay
    right
    absolute
    v-model="panelOpen"
  >
    <v-btn
      x-small
      :class="['tools-caret-down']"
      icon
      elevation="0"
      tile
      absolute
      @click="panelOpen = !panelOpen"
    >
      <v-icon color="white" x-small>{{ !panelOpen ? 'fa-chevron-left' : 'fa-chevron-right'}}</v-icon>
    </v-btn>
    <v-expansion-panels
      v-model="panels"
      accordion
      flat
      tile
      multiple
      class="custom-expansion-panels"
    >
      <WowsEntitySection v-if="game === Game.WOWS && currentTacticId && isAuthorisedAndCanvasLoaded"></WowsEntitySection>
      <WotEntitySection v-if="game === Game.WOT && currentTacticId && isAuthorisedAndCanvasLoaded"></WotEntitySection>
      <!-- Team section -->
      <WowsTeamSection v-if="game === Game.WOWS && currentTacticId && isAuthorisedAndCanvasLoaded"></WowsTeamSection>
      <WotTeamSection v-if="game === Game.WOT && currentTacticId && isAuthorisedAndCanvasLoaded"></WotTeamSection>
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
import { SocketUserGetters } from '@/store/modules/socket/user'

const SocketTeam = namespace(Namespaces.SOCKET_TEAM)
const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)
const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
const SocketUser = namespace(Namespaces.SOCKET_USER)

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
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED_CANVAS_LOADED) isAuthorisedAndCanvasLoaded!: boolean
  Game = Game
  panelOpen = true
  panels = [0, 1, 2, 3]
}
</script>
<style scoped lang="scss">
.custom-navigation-drawer {
  box-shadow: none;
  background-color: #FFFFFFFF;
  height: calc(100vh - 52px) !important;
  top: 52px !important;
  overflow: visible !important;
  visibility: visible !important;
}
.tools-caret-down {
  margin-top:3px;
  position: absolute;
  border-radius: 8px 0 0 8px;
  left: -14px;
  top: calc(-56px + (100vh / 2));
  width:14px;
  height: 60px;
  background-color: $room-primary;
  color: white;
  transition:0.2s ease-in-out;
}
</style>
<style lang="scss">
.custom-expansion-panel {
  border-left: 0.85px solid rgba(0, 0, 0, 0.12)
}
.custom-navigation-drawer .v-navigation-drawer__content::-webkit-scrollbar {
  width: 8px;
  background-color: #e7e7e7;
  border-radius: 10px;
}

.custom-navigation-drawer .v-navigation-drawer__content::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(111, 90, 90, 0.2);
  background-color: #dcdcdc;
}
.custom-navigation-drawer .v-navigation-drawer__content::-webkit-scrollbar-thumb {
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.2);
  background-color: #bbbbbb;
  cursor: pointer;
}
.custom-expansion-panel-header {
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: $room-primary;
}
</style>
