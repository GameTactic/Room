<template>
  <div
    :class="`full-width-height ${dragEnabled ? 'dragEnabled' : ''}`"
    ref="app"
    @mousedown="mouseDownAction"
    @mousemove="mouseMoveAction"
    @mouseup="mouseUpAction"
    @drop="onDropHandler"
    @dragover="$event.preventDefault()"
  >
    <the-canvas
      v-show="isCanvasLoaded"
      ref="stage"
    />
    <the-nav />
    <the-tool-panel class="d-none d-sm-flex" />
    <the-entity-panel class="d-none d-sm-flex" />
    <the-tactic-selector />
    <the-create-new-tactic-overlay />
    <the-update-tactic-overlay />
  </div>
</template>

<script lang="ts">
import TheNav from '@/components/navigation/TheNav.vue'
import TheToolPanel from '@/components/TheToolPanel.vue'
import TheCanvas from '@/components/TheCanvas.vue'
import TheEntityPanel from '@/components/TheEntityPanel.vue'
import TheTacticSelector from '@/components/tactic-selector/TheTacticSelector.vue'
import Component, { mixins } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { CanvasElement, VueKonvaStage } from '@/types/Canvas'
import TheCreateNewTacticOverlay from '@/components/overlays/TheCreateNewTacticOverlay.vue'
import TheUpdateTacticOverlay from '@/components/overlays/TheUpdateTacticOverlay.vue'
import { SocketStageActions, SocketStageGetters } from '@/store/modules/socket/stage'
import PointerEventMapper, { CustomStageConfig } from '@/util/PointerEventMapper'
import { SocketCanvasAction } from '@/store/modules/socket/canvas'
import { namespace } from 'vuex-class'
import { EventBus } from '@/event-bus'
import RoomSocket from '@/mixins/RoomSockets'
import { Item } from '@/types/Games/Index'
import { AppToolGetters } from '@/store/modules/app/tools'
import { Tool } from '@/tools/Tool'
import { SocketTacticGetters, SocketTacticAction } from '../store/modules/socket/tactic'
import { Tactic, Collection } from '../store/types'
import uuid from 'uuid'
import { AppAuthenticationGetters, ExtendedJWT } from '../store/modules/app/authentication'
import { SocketRoomAction } from '../store/modules/socket/room'
import { AppRoomAction, AppRoomGetters } from '../store/modules/app/room'
import { Namespaces } from '@/store'

const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)
const AppRoom = namespace(Namespaces.APP_ROOM)
const AppTools = namespace(Namespaces.APP_TOOLS)
const SocketCanvas = namespace(Namespaces.SOCKET_CANVAS)
const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
const SocketStage = namespace(Namespaces.SOCKET_STAGE)
const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)

@Component({
  name: 'TheRoom',
  mixins: [RoomSocket],
  components: {
    TheCreateNewTacticOverlay,
    TheUpdateTacticOverlay,
    TheNav,
    TheToolPanel,
    TheCanvas,
    TheEntityPanel,
    TheTacticSelector
  }
})
export default class TheRoom extends mixins(RoomSocket) {
  @Prop() id!: string
  @SocketStage.Getter(SocketStageGetters.STAGE_CONFIG) stageConfig!: CustomStageConfig
  @AppTools.Getter(AppToolGetters.TOOL) findTool!: (name: string) => Tool | void
  @SocketTactic.Getter(SocketTacticGetters.TACTICS) tactics!: () => Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.COLLECTIONS) collections!: () => Collection[]
  @AppAuthentication.Getter(AppAuthenticationGetters.JWT) jwt!: ExtendedJWT
  @AppRoom.Getter(AppRoomGetters.IS_CANVAS_LOADED) isCanvasLoaded!: boolean
  @SocketCanvas.Action(SocketCanvasAction.SET_CANVAS_ELEMENT) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @SocketCanvas.Action(SocketCanvasAction.SET_CANVAS_ELEMENT_HISTORY) setCanvasElementsHistory!: (canvasElements: CanvasElement[]) => void
  @SocketStage.Action(SocketStageActions.SET_MAP_SRC) setMapSrc!: (mapSrc: string) => void
  @SocketStage.Action(SocketStageActions.SET_CONFIG) setConfig!: (config: CustomStageConfig) => void
  @SocketTactic.Action(SocketTacticAction.SET_COLLECTIONS) setCollections!: (collections: Collection[]) => void
  @SocketTactic.Action(SocketTacticAction.SET_TACTICS) setTactics!: (tactics: Tactic[]) => void
  @AppRoom.Action(AppRoomAction.SET_IS_CANVAS_LOADED) setIsCanvasLoaded!: (isCanvasLoaded: boolean) => void
  @SocketRoom.Action(SocketRoomAction.SET_ROOM_ID) setRoomId!: (roomId: string) => void

  created () {
    this.setRoomId(window.location.pathname.replace('/', ''))
  }
  $refs!: {
    app: HTMLDivElement;
    stage: VueKonvaStage;
  }
  dragEnabled = false

  @Watch('jwt')
  onPropertyChanged () {
    const jti = this.jwt?.jti
    if (jti) {
      this.isRoomNew(jti)
    }
  }

  mouseDownAction (e: MouseEvent) {
    if (e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
      this.dragEnabled = true
      EventBus.$emit('mouseAction', e)
    }
  }

  mouseMoveAction (e: MouseEvent) {
    if (this.dragEnabled && e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
      EventBus.$emit('mouseAction', e)
    }
  }

  mouseUpAction (e: MouseEvent) {
    if (this.dragEnabled && e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
      this.dragEnabled = false
      EventBus.$emit('mouseAction', e)
    }
  }

  onDropHandler (e: DragEvent) {
    if (this.isCanvasLoaded && e.dataTransfer) {
      const item: Item | void = JSON.parse(e.dataTransfer.getData('entity'))
      if (item) {
        const entityTool: Tool | void = this.findTool('entity')
        if (entityTool && entityTool.entityToRequest && entityTool.renderCanvas) {
          entityTool.renderCanvas(entityTool.entityToRequest(item, PointerEventMapper.globalEventMapper(e)))
        }
      }
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
  .full-width-height {
    width: 100%;
    height: 100%;
    overflow-x: hidden;

    &.dragEnabled::v-deep {
      cursor: move !important;
    }
  }
</style>
