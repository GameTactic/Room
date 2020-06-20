<template>
  <v-stage
    ref="stage"
    class="konva-stage"
    :class="[enabledTool ? enabledTool.name : '']"
    :config="stageConfig"
    @mousedown="onMouseHandler"
    @mousemove="onMouseHandler"
    @mouseup="onMouseHandler"
    @touchstart="onTouchHandler"
    @touchmove="onTouchHandler"
    @touchend="onTouchHandler"
  >
    <v-layer ref="layer" :config="{ id: Math.random().toString(36) }"></v-layer>
  </v-stage>
</template>

<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { Tool } from '@/tools/Tool'
import { CanvasElement, VueKonvaLayer, VueKonvaStage } from '@/types/Canvas'
import { namespace } from 'vuex-class'
import { AppToolGetters } from '@/store/modules/app/tools'
import { SocketCanvasAction, SocketCanvasGetters } from '@/store/modules/socket/canvas'
import Konva from 'konva'
import { EventBus } from '@/event-bus'
import PointerEventMapper, { CustomStageConfig } from '@/util/PointerEventMapper'
import { KonvaPointerEvent } from 'konva/types/PointerEvents'
import HandleRenderShapes from '@/util/HandleRenderShapes'
import { AppStageActions, AppStageGetters } from '@/store/modules/app/stage'
import { SocketStageGetters } from '@/store/modules/socket/stage'
import { AppLayerActions, AppLayerGetters } from '@/store/modules/app/layer'
import CanvasSockets from '@/mixins/CanvasSockets'
import StageWatcher from '@/mixins/StageWatcher'
import { Namespaces } from '@/store'

const AppLayer = namespace(Namespaces.APP_LAYER)
const AppStage = namespace(Namespaces.APP_STAGE)
const AppTools = namespace(Namespaces.APP_TOOLS)
const SocketCanvas = namespace(Namespaces.SOCKET_CANVAS)
const SocketStage = namespace(Namespaces.SOCKET_STAGE)

@Component({
  name: 'TheCanvas',
  mixins: [CanvasSockets, StageWatcher]
})

export default class TheCanvas extends mixins(CanvasSockets, StageWatcher) {
  @AppTools.Getter(AppToolGetters.ENABLED_TOOL) enabledTool!: Tool
  @AppTools.Getter(AppToolGetters.TOOLS) tools!: Tool[]
  @AppLayer.Getter(AppLayerGetters.LAYER) layerNode!: Konva.Layer
  @AppStage.Getter(AppStageGetters.STAGE) stage!: Konva.Stage
  @AppStage.Getter(AppStageGetters.STAGE_ZOOM) stageZoom!: number
  @SocketCanvas.Getter(SocketCanvasGetters.CANVAS_ELEMENTS) canvasElements!: CanvasElement[]
  @SocketStage.Getter(SocketStageGetters.STAGE_CONFIG) stageConfig!: CustomStageConfig
  @AppLayer.Action(AppLayerActions.LAYER_SET) setLayer!: (layer: Konva.Layer) => void
  @AppStage.Action(AppStageActions.SET_STAGE) setStage!: (stage: Konva.Stage) => void
  @SocketCanvas.Action(SocketCanvasAction.ADD_CANVAS_ELEMENT) addCanvasElement!: (canvasElement: CanvasElement) => void

  $refs!: {
    layer: VueKonvaLayer;
    stage: VueKonvaStage;
  }

  mounted () {
    this.setLayer(this.$refs.layer.getNode())
    this.setStage(this.$refs.stage.getNode())
    this.renderShapes()
  }

  created () {
    EventBus.$on('mouseAction', (e: MouseEvent) => {
      this.onMouseHandler(PointerEventMapper.mouseEventMapper(e) as KonvaPointerEvent)
    })
  }

  renderShapes (): void {
    const renderShapesHandler = new HandleRenderShapes(this.$store)
    renderShapesHandler.handle()
  }

  onMouseHandler (e: Konva.KonvaPointerEvent): void {
    let type = ''
    switch (e.evt.type) {
      case 'mousedown': type = 'mouseDownAction'; break
      case 'mousemove': type = 'mouseMoveAction'; break
      case 'mouseup': type = 'mouseUpAction'; break
    }
    const event = PointerEventMapper.globalEventMapper(e)
    if (this.enabledTool?.[type]) {
      this.enabledTool[type](event)
    } else if (this.enabledTool?.[`canvas${type.substring(5)}`]) {
      this.enabledTool[`canvas${type.substring(5)}`](event)
    }
    if (type === 'mouseUpAction') {
      this.renderShapes()
    }
  }

  onTouchHandler = (event: TouchEvent): void => {
    this.onMouseHandler(PointerEventMapper.touchEventMapper(event) as KonvaPointerEvent)
  }

  // eslint-disable-next-line
  [key: string]: any
}
</script>
<style scoped lang="scss">
.konva-stage {
  touch-action: none;
  background-color: white;
  position: absolute;
  /* These are FA icons and might need replacing. */
  &.ping::v-deep canvas {
    cursor: pointer;
  }
  &.move::v-deep canvas {
    cursor: default;
  }
  &.line::v-deep canvas {
    cursor: url('~@/assets/cursor/pen.png'), auto;
  }
  &.freeDraw::v-deep canvas {
    cursor: url('~@/assets/cursor/pen.png'), auto;
  }
  &.erase::v-deep canvas {
    cursor: url('~@/assets/cursor/eraser.png'), auto;
  }
  &.circle::v-deep canvas {
    cursor: url('~@/assets/cursor/circle.png'), auto;
  }
  &.moveCanvas::v-deep canvas {
    cursor: grab;
  }
  &.moveCanvas.mouseDown::v-deep canvas {
    cursor: grabbing;
  }
  /* Extra Tools Here */
}
</style>
