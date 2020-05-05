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
    <v-layer ref="layer" :config="{ id: canvasEntity.canvasElement.layerId }"></v-layer>
  </v-stage>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator'
import Component, { mixins } from 'vue-class-component'
import { ToolInterface } from '@/tools/Tool'
import { CanvasElement, VueKonvaLayer, VueKonvaStage } from '@/types/Canvas'
import { Action, Getter } from 'vuex-class'
import { ToolGetters } from '@/store/modules/tools'
import { CanvasAction, CanvasGetters, HideCanvasElementInterface } from '@/store/modules/canvas'
import Konva from 'konva'
import { SocketGetters } from '@/store/modules/socket'
import { EventBus } from '@/event-bus'
import PointerEventMapper, { CustomStageConfig } from '@/util/PointerEventMapper'
import { KonvaPointerEvent } from 'konva/types/PointerEvents'
import HandleRenderShapes from '@/util/HandleRenderShapes'
import { StageActions, StageGetters } from '@/store/modules/stage'
import MapCanvas from '@/tools/util/MapCanvas'
import { LayerActions, LayerGetters } from '@/store/modules/layer'
import { CanvasEntityGetters, CanvasEntityState } from '@/store/modules/canvasEntity'
import CanvasSockets from '@/mixins/CanvasSockets'

@Component({
  name: 'TheCanvas',
  mixins: [CanvasSockets]
})

export default class TheCanvas extends mixins(CanvasSockets) {
  @Prop() id!: string
  @Getter(`tools/${ToolGetters.ENABLED_TOOL}`) enabledTool!: ToolInterface
  @Getter(`tools/${ToolGetters.TOOLS}`) tools!: ToolInterface[]
  @Getter(`socket/${SocketGetters.SOCKET}`) socket!: WebSocket
  @Action(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT}`) addCanvasElement!: (canvasElement: CanvasElement) => void
  @Action(`canvas/${CanvasAction.HIDE_CANVAS_ELEMENT}`) hideCanvasElement!: (payload: HideCanvasElementInterface) => void
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS}`) canvasElements!: CanvasElement[]
  @Getter(`stage/${StageGetters.STAGE_ZOOM}`) stageZoom!: number
  @Getter(`stage/${StageGetters.STAGE_CONFIG}`) stageConfig!: CustomStageConfig
  @Action(`layer/${LayerActions.LAYER_SET}`) setLayer!: (layer: Konva.Layer) => void
  @Getter(`layer/${LayerGetters.LAYER}`) layerNode!: Konva.Layer
  @Action(`stage/${StageActions.SET_STAGE}`) setStage!: (stage: Konva.Stage) => void
  @Getter(`stage/${StageGetters.STAGE}`) stage!: Konva.Stage
  @Getter(`canvasEntity/${CanvasEntityGetters.CANVAS_ENTITY}`) canvasEntity!: CanvasEntityState

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
    this.$store.watch(
      () => {
        return this.stageConfig.mapSrc
      },
      (newMap: string, oldMap: string) => {
        if (newMap !== oldMap) {
          const mapCanvas = new MapCanvas()
          mapCanvas.setMap()
          this.renderShapes()
        }
      }
    )

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
    cursor: move;
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
