<template>
  <div
    :class="`full-width-height ${dragEnabled ? 'dragEnabled' : ''}`"
    ref="app"
    @mousedown="mouseDownAction"
    @mousemove="mouseMoveAction"
    @mouseup="mouseUpAction"
  >
    <the-canvas v-if="loadCanvas" ref="stage" :id="id"/>
    <the-nav-large class="the-nav-large" :id="id" :loadCanvas="loadCanvas"/>
    <the-nav-small class="the-nav-small" :id="id" :loadCanvas="loadCanvas"/>
    <the-tool-panel class="custom-hide-on-mobile" :id="id"/>
    <the-entity-panel  class="custom-hide-on-mobile" :id="id"/>
    <the-create-new-tactic-overlay :id="id" />
  </div>
</template>

<script lang="ts">
import TheNavLarge from '@/components/navigation/TheNavLarge.vue'
import TheNavSmall from '@/components/navigation/TheNavSmall.vue'
import TheToolPanel from '@/components/TheToolPanel.vue'
import TheCanvas from '@/components/TheCanvas.vue'
import TheEntityPanel from '@/components/TheEntityPanel.vue'
import Component, { mixins } from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Map } from '@/store/modules/types'
import { CanvasElement, VueKonvaStage } from '@/types/Canvas'
import TheCreateNewTacticOverlay from '@/components/overlays/TheCreateNewTacticOverlay.vue'
import { StageActions, StageGetters } from '@/store/modules/stage'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import { CanvasAction } from '@/store/modules/canvas'
import { Action, Getter } from 'vuex-class'
import { EventBus } from '@/event-bus'
import RoomSocket from '@/mixins/RoomSockets'

  @Component({
    name: 'Room',
    mixins: [RoomSocket],
    components: {
      TheCreateNewTacticOverlay,
      TheNavLarge,
      TheNavSmall,
      TheToolPanel,
      TheCanvas,
      TheEntityPanel
    }
  })
export default class Room extends mixins(RoomSocket) {
  @Prop() id!: string
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT}`) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT_HISTORY}`) setCanvasElementsHistory!: (canvasElements: CanvasElement[]) => void
  @Getter(`stage/${StageGetters.STAGE_CONFIG}`) stageConfig!: CustomStageConfig
  @Action(`stage/${StageActions.SET_MAP_SRC}`) setMapSrc!: (mapSrc: string) => void
  @Action(`stage/${StageActions.SET_CONFIG}`) setConfig!: (config: CustomStageConfig) => void

  $refs!: {
    app: HTMLDivElement;
    stage: VueKonvaStage;
  }
  loadCanvas = true
  dragEnabled = false

  mouseDownAction (e: MouseEvent) {
    this.dragEnabled = true
    if (e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
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
