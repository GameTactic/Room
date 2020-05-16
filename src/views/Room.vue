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
    <the-nav-large class="the-nav-large" />
    <the-nav-small class="the-nav-small" />
    <the-tool-panel class="custom-hide-on-mobile" />
    <the-entity-panel class="custom-hide-on-mobile" />
    <the-tactic-selector class="custom-hide-on-mobile"  />
    <the-create-new-tactic-overlay />
    <the-update-tactic-overlay />
  </div>
</template>

<script lang="ts">
import TheNavLarge from '@/components/navigation/TheNavLarge.vue'
import TheNavSmall from '@/components/navigation/TheNavSmall.vue'
import TheToolPanel from '@/components/TheToolPanel.vue'
import TheCanvas from '@/components/TheCanvas.vue'
import TheEntityPanel from '@/components/TheEntityPanel.vue'
import TheTacticSelector from '@/components/tactic-selector/TheTacticSelector.vue'
import Component, { mixins } from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'
import { CanvasElement, VueKonvaStage } from '@/types/Canvas'
import TheCreateNewTacticOverlay from '@/components/overlays/TheCreateNewTacticOverlay.vue'
import TheUpdateTacticOverlay from '@/components/overlays/TheUpdateTacticOverlay.vue'
import { StageActions, StageGetters } from '@/store/modules/stage'
import PointerEventMapper, { CustomStageConfig } from '@/util/PointerEventMapper'
import { CanvasAction } from '@/store/modules/canvas'
import { Action, Getter } from 'vuex-class'
import { EventBus } from '@/event-bus'
import RoomSocket from '@/mixins/RoomSockets'
import { Item } from '@/types/Games'
import { ToolGetters } from '@/store/modules/tools'
import { Tool } from '@/tools/Tool'
import { TacticGetters, TacticAction } from '../store/modules/tactic'
import { Tactic, Collection } from '../store/modules/types'
import uuid from 'uuid'
import { AuthenticationGetters, ExtendedJWT } from '../store/modules/authentication'
import { RoomAction, RoomGetters } from '../store/modules/room'

  @Component({
    name: 'Room',
    mixins: [RoomSocket],
    components: {
      TheCreateNewTacticOverlay,
      TheUpdateTacticOverlay,
      TheNavLarge,
      TheNavSmall,
      TheToolPanel,
      TheCanvas,
      TheEntityPanel,
      TheTacticSelector
    }
  })
export default class Room extends mixins(RoomSocket) {
  @Prop() id!: string
  @Getter(`stage/${StageGetters.STAGE_CONFIG}`) stageConfig!: CustomStageConfig
  @Getter(`tools/${ToolGetters.TOOL}`) findTool!: (name: string) => Tool | void
  @Getter(`tactic/${TacticGetters.TACTICS}`) tactics!: () => Tactic[]
  @Getter(`tactic/${TacticGetters.COLLECTIONS}`) collections!: () => Collection[]
  @Getter(`authentication/${AuthenticationGetters.JWT}`) jwt!: ExtendedJWT
  @Getter(`room/${RoomGetters.IS_CANVAS_LOADED}`) isCanvasLoaded!: boolean
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT}`) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT_HISTORY}`) setCanvasElementsHistory!: (canvasElements: CanvasElement[]) => void
  @Action(`stage/${StageActions.SET_MAP_SRC}`) setMapSrc!: (mapSrc: string) => void
  @Action(`stage/${StageActions.SET_CONFIG}`) setConfig!: (config: CustomStageConfig) => void
  @Action(`tactic/${TacticAction.SET_COLLECTIONS}`) setCollections!: (collections: Collection[]) => void
  @Action(`tactic/${TacticAction.SET_TACTICS}`) setTactics!: (tactics: Tactic[]) => void
  @Action(`room/${RoomAction.SET_IS_CANVAS_LOADED}`) setIsCanvasLoaded!: (isCanvasLoaded: boolean) => void

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

  @media (max-width: 899px) {
    .custom-hide-on-mobile {
      display: none;
    }
  }

  @media (max-width: 899px) {
    .the-nav-large {
      display: none;
    }
  }

  @media (min-width: 900px) {
    .the-nav-small {
      display: none;
    }
  }
</style>
