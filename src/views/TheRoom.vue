<template>
  <div
    :class="`full-width-height ${isDragEnabled ? 'drag-enabled' : ''}`"
    ref="app"
    @mousedown="mouseDownAction"
    @mousemove="mouseMoveAction"
    @mouseup="mouseUpAction"
    @dragover="$event.preventDefault()"
  >
    <the-canvas
      class="z-index-under-overlay"
      v-show="isCanvasLoaded"
      ref="stage"
    />
    <v-overlay opacity="0.2" :value="isMapChanging" class="z-index-same-as-overlay">
      <v-icon class="custom-spinner">fa-spinner</v-icon>
    </v-overlay>
    <the-nav class="z-index-above-overlay"/>
    <the-tool-panel class="d-none d-sm-flex z-index-above-overlay" />
    <the-entity-panel v-if="isAuthorised" class="d-none d-sm-flex z-index-above-overlay" />
    <the-create-new-tactic-overlay />
    <the-update-tactic-overlay />
    <pinned-tactics class="z-index-above-overlay" v-if="isAuthorisedCanvasLoaded"></pinned-tactics>
  </div>
</template>

<script lang="ts">
import TheNav from '@/components/navigation/TheNav.vue'
import TheToolPanel from '@/components/TheToolPanel.vue'
import TheCanvas from '@/components/TheCanvas.vue'
import TheEntityPanel from '@/components/TheEntityPanel.vue'
import Component, { mixins } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { VueKonvaStage } from '@/types/Canvas'
import TheCreateNewTacticOverlay from '@/components/overlays/TheCreateNewTacticOverlay.vue'
import TheUpdateTacticOverlay from '@/components/overlays/TheUpdateTacticOverlay.vue'
import { namespace } from 'vuex-class'
import { EventBus } from '@/event-bus'
import RoomSocket from '@/mixins/RoomSockets'
import { AppToolGetters } from '@/store/modules/app/tools'
import { Tool } from '@/tools/Tool'
import { SocketTacticGetters, SocketTacticAction } from '@/store/modules/socket/tactic'
import { Tactic, Collection, RoleTypes } from '@/store/types'
import uuid from 'uuid'
import { AppAuthenticationGetters, ExtendedJWT } from '@/store/modules/app/authentication'
import { SocketRoomAction } from '@/store/modules/socket/room'
import { Namespaces } from '@/store'
import { SocketUserGetters } from '@/store/modules/socket/user'
import PinnedTactics from '@/components/pinned-tactics/PinnedTactics.vue'
import { AppRoomGetters } from '@/store/modules/app/room'

const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)
const AppTools = namespace(Namespaces.APP_TOOLS)
const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)
const SocketUser = namespace(Namespaces.SOCKET_USER)
const AppRoom = namespace(Namespaces.APP_ROOM)

@Component({
  name: 'TheRoom',
  mixins: [RoomSocket],
  components: {
    PinnedTactics,
    TheCreateNewTacticOverlay,
    TheUpdateTacticOverlay,
    TheNav,
    TheToolPanel,
    TheCanvas,
    TheEntityPanel
  }
})
export default class TheRoom extends mixins(RoomSocket) {
  @Prop() id!: string
  @AppTools.Getter(AppToolGetters.TOOL) findTool!: (name: string) => Tool | void
  @SocketTactic.Getter(SocketTacticGetters.TACTICS) tactics!: () => Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.COLLECTIONS) collections!: () => Collection[]
  @AppAuthentication.Getter(AppAuthenticationGetters.JWT) jwt!: ExtendedJWT
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED) isAuthorised!: boolean;
  @AppRoom.Getter(AppRoomGetters.IS_CANVAS_LOADED) isCanvasLoaded!: boolean;
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED_CANVAS_LOADED) isAuthorisedCanvasLoaded!: boolean
  @SocketTactic.Action(SocketTacticAction.SET_COLLECTIONS) setCollections!: (collections: Collection[]) => void
  @SocketRoom.Action(SocketRoomAction.SET_ROOM_ID) setRoomId!: (roomId: string) => void

  created () {
    EventBus.$on('MapChanging', (v: boolean) => { this.isMapChanging = v })
    this.setRoomId(window.location.pathname.replace('/', ''))
  }

  $refs!: {
    app: HTMLDivElement;
    stage: VueKonvaStage;
  }
  isDragEnabled = false
  isMapChanging = false

  @Watch('jwt')
  onPropertyChanged () {
    const jti = this.jwt?.jti
    if (jti) {
      this.isRoomNew(jti)
      // For development purposes
      this.setUsers([{
        jti: jti,
        name: this.jwt.username,
        onTacticId: '1',
        isOnline: true,
        lastOnline: new Date(),
        roles: [
          {
            id: '1',
            roleTypes: RoleTypes.USER,
            assignedBy: jti
          },
          {
            id: '2',
            roleTypes: RoleTypes.ADMIN,
            assignedBy: jti
          }
        ]
      }])
    }
  }

  mouseDownAction (e: MouseEvent) {
    if (e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
      this.isDragEnabled = true
      EventBus.$emit('mouseAction', e)
    }
  }

  mouseMoveAction (e: MouseEvent) {
    if (this.isDragEnabled && e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
      EventBus.$emit('mouseAction', e)
    }
  }

  mouseUpAction (e: MouseEvent) {
    if (this.isDragEnabled && e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
      this.isDragEnabled = false
      EventBus.$emit('mouseAction', e)
    }
  }

  // Check to see if the room has been created
  isRoomNew (jti: string) {
    if (!this.collections.length && !this.tactics.length) {
      this.setCollections([{
        id: uuid(),
        name: 'root',
        parentCollectionId: undefined,
        lockedBy: undefined,
        isPinned: false,
        createdBy: jti
      }])
    }
  }
}
</script>
<style scoped lang="scss">
  .z-index-above-overlay {
    z-index: 5;
  }
  .z-index-under-overlay {
    z-index: 0;
  }
  .z-index-same-as-overlay {
    z-index: 1
  }
  .full-width-height {
    width: 100%;
    height: 100%;
    overflow-x: hidden;

    &.drag-enabled::v-deep {
      cursor: move !important;
    }
  }
  .custom-spinner {
    animation: spin;
    animation-iteration-count: infinite;
    animation-duration: 2s;
  }
  @keyframes spin {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
