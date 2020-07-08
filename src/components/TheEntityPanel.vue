<template>
  <v-navigation-drawer
    v-model="panelOpen"
    class="custom-navigation-drawer"
    width="300"
    temporary
    stateless
    hide-overlay
    right
    absolute
  >
    <v-expansion-panels
      v-model="panels"
      accordion
      flat
      tile
      multiple
      class="custom-expansion-panels"
    >
      <the-entity-list v-if="isAuthorisedAndCanvasLoaded && currentTacticId" />
      <the-team-list v-if="isAuthorisedAndCanvasLoaded && currentTacticId" />
      <the-tactic-list />
      <the-user-list />
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { SocketTacticGetters } from '@/store/modules/socket/tactic'
import { SocketUserGetters } from '@/store/modules/socket/user'
import TheEntityList from '@/components/entity-panel/sections/entity/TheEntityList.vue'
import TheTacticList from '@/components/entity-panel/sections/tactic/TheTacticList.vue'
import TheUserList from '@/components/entity-panel/sections/user/TheUserList.vue'
import TheTeamList from '@/components/entity-panel/sections/team/TheTeamList.vue'

const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)
const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'TheEntityPanel',
  components: {
    TheEntityList,
    TheTacticList,
    TheUserList,
    TheTeamList
  }
})
export default class EntityPanel extends Vue {
  @Prop() private readonly panelOpen: boolean = true;
  @SocketTactic.Getter(SocketTacticGetters.CURRENT_TACTIC_ID) private readonly currentTacticId!: string | undefined
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED_CANVAS_LOADED) isAuthorisedAndCanvasLoaded!: boolean
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
</style>
<style lang="scss">
.custom-navigation-drawer .v-navigation-drawer__content {
  @include custom-scroll-bar;
}
</style>
