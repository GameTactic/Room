<template>
  <v-stage
    ref="stage"
    id="stage"
    class="konva-stage"
    :class="[enabledTool ? enabledTool.name : '']"
    :config="stageSize"
    @mousedown="onMouseDownHandler"
    @mouseup="onMouseUpHandler"
    @mousemove="onMouseMoveHandler"
    @touchstart="onTouchDownHandler"
    @touchmove="onTouchMoveHandler"
    @touchend="onTouchUpHandler"
  >
    <v-layer ref="layer" :config="{ id: canvasElement.layerId }" />
  </v-stage>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { Tool, Tracker } from '@/tools/Tool'
import { CanvasElement, VueKonvaLayer, VueKonvaStage } from '@/types/Canvas'
import Vue from 'vue'
import { Namespaces } from '@/store'
import { Action, Getter, namespace } from 'vuex-class'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'
import { CanvasAction, CanvasGetters, HideCanvasElementInterface } from '@/store/modules/canvas'
import Konva from 'konva'
import { SocketActions, SocketGetters } from '@/store/modules/socket'
import { EventBus } from '@/event-bus'
import PointerEventMapper from '@/Util/PointerEventMapper'
import { KonvaPointerEvent } from 'konva/types/PointerEvents'
import HandleSocketMessage, { SocketHandlerChange } from '@/Util/HandleSocketMessage'
import HandleRenderShapes from '@/Util/HandleRenderShapes'
import HandleAddText from '@/Util/HandleAddText'
import HandleMouseUp, { MouseUpChange } from '@/Util/HandleMouseUp'
import HandleUndoRedo from '@/Util/HandleUndoRedo'

const Tools = namespace(Namespaces.TOOLS)
const Sockets = namespace(Namespaces.SOCKET)

@Component({
  name: 'TheCanvas'
})

export default class TheCanvas extends Vue {
  @Prop() private id!: string
  @Tools.Action(ToolsAction.DISABLE) disable!: () => void
  @Action(`tools/${ToolsAction.ENABLE}`) enable!: () => void
  @Action(`tools/${ToolsAction.ENABLE_TOOL}`) enableTool!: (name: string) => void
  @Getter(`tools/${ToolGetters.ENABLED_TOOL}`) enabledTool!: Tool
  @Getter(`tools/${ToolGetters.ENABLED}`) enabled!: boolean
  @Getter(`tools/${ToolGetters.TOOLS}`) tools!: Tool[]
  @Sockets.Getter(SocketGetters.SOCKET) socket!: WebSocket
  @Sockets.Action(SocketActions.SEND_IF_OPEN) send!: (message: string) => void
  @Action(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT}`) addCanvasElement!: (canvasElement: CanvasElement) => void
  @Action(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`) addCanvasElementHistory!: (canvasElement: CanvasElement) => void
  @Action(`canvas/${CanvasAction.HIDE_CANVAS_ELEMENT}`) hideCanvasElement!: (payload: HideCanvasElementInterface) => void
  @Action(`canvas/${CanvasAction.DELETE_CANVAS_ELEMENT}`) deleteCanvasElement!: (canvasElement: CanvasElement) => void
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS}`) canvasElements!: CanvasElement[]
  @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`) canvasElementsHistory!: CanvasElement[]

  stageSize = {
    width: window.innerWidth,
    height: window.innerHeight
  }

  canvasElement: CanvasElement = {
    jti: 'SAM',
    id: '',
    data: [],
    tool: {
      name: ''
    },
    layerId: Math.random().toString(36),
    tracker: Tracker.ADDITION,
    change: false,
    hasMoved: false,
    position: { x: 0, y: 0 }
  }

  $refs!: {
    layer: VueKonvaLayer;
    stage: VueKonvaStage;
  }

  created () {
    window.addEventListener('resize', (e) => {
      const currentTarget = e.currentTarget as Window
      if (currentTarget) {
        this.$data.stageSize = {
          width: currentTarget.innerWidth,
          height: currentTarget.innerHeight
        }
      }
    }, true)

    window.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'z') {
        EventBus.$emit('undoRedo', 'Undo')
      } else if (e.ctrlKey && e.key === 'y') {
        EventBus.$emit('undoRedo', 'Redo')
      }
    })

    EventBus.$on('undoRedo', (undoRedo: string) => {
      const handleUndoRedo = new HandleUndoRedo(this.canvasElementsHistory, this.canvasElements)
      const response = handleUndoRedo.handleUndoRedo(undoRedo)
      if (response) {
        this.addCanvasElementHistory(response.addToHistory)
        this.socket.send(JSON.stringify(response.returnElement))
        this.renderShapes()
      }
    })

    EventBus.$on('addText', (canvasElement: CanvasElement) => {
      const handleAddText = new HandleAddText(canvasElement, this.layerNode, this.socket, this.canvasElements)
      const result = handleAddText.handle()
      if (!result) {
        this.deleteCanvasElement(canvasElement)
      }
    })

    this.socket.onmessage = (data: MessageEvent) => {
      const socketMessageHandler = new HandleSocketMessage(JSON.parse(data.data).payload, this.$data.canvasElement, this.tools, this.layerNode, this.canvasElements)
      const response = socketMessageHandler.handle()
      if (response) {
        if (response.change === SocketHandlerChange.ADD && response.payload.canvasElement) {
          this.addCanvasElement(response.payload.canvasElement)
        } else if (response.change === SocketHandlerChange.HIDE && response.payload.groupIds) {
          response.payload.groupIds.forEach((groupId: string) => {
            this.hideCanvasElement({ fromSocket: true, id: groupId })
          })
        }
      }
      this.renderShapes()
    }
  }

  beforeDestroy () {
    window.removeEventListener('resize', () => null)
  }

  renderShapes (): void {
    const renderShapesHandler = new HandleRenderShapes(this.layerNode, this.canvasElements, this.tools)
    renderShapesHandler.handle()
  }

  onMouseDownHandler (e: Konva.KonvaPointerEvent): void {
    if (this.enabledTool?.mouseDownAction) {
      this.enable()
      this.enabledTool.mouseDownAction(e, this.$data.canvasElement, this.layerNode, this.socket)
    }
  }

  onMouseMoveHandler (e: Konva.KonvaPointerEvent): void {
    if (this.enabledTool?.mouseMoveAction && this.enabled) {
      this.enabledTool.mouseMoveAction(e, this.$data.canvasElement, this.layerNode, this.socket)
    }
  }

  onMouseUpHandler (e: Konva.KonvaPointerEvent): void {
    if (this.enabledTool?.mouseUpAction && this.enabled) {
      this.disable()
      this.enabledTool.mouseUpAction(e, this.$data.canvasElement, this.layerNode, this.socket)
      const handleMouseUp = new HandleMouseUp(this.$data.canvasElement, this.enabledTool, this.layerNode, this.canvasElements, e, this.socket)
      const response = handleMouseUp.handle()
      if (response) {
        if (response.change === MouseUpChange.ADD && response.payload.canvasElement) {
          this.addCanvasElement(response.payload.canvasElement)
        } else if (response.change === MouseUpChange.ADD_HISTORY && response.payload.canvasElementHistory) {
          this.addCanvasElementHistory(response.payload.canvasElementHistory)
        } else if (response.change === MouseUpChange.HIDE && response.payload.groupIds) {
          response.payload.groupIds.forEach((groupId: string) => {
            this.hideCanvasElement({ fromSocket: false, id: groupId })
          })
        } else if (response.change === MouseUpChange.ADD_AND_HISTORY && response.payload.canvasElement && response.payload.canvasElementHistory) {
          this.addCanvasElement(response.payload.canvasElement)
          this.addCanvasElementHistory(response.payload.canvasElementHistory)
        }
      }
      this.renderShapes()
    }
  }

  onTouchDownHandler = (event: TouchEvent): void => {
    this.onMouseDownHandler(PointerEventMapper.touchEventMapper(event) as KonvaPointerEvent)
  }

  onTouchMoveHandler = (event: TouchEvent): void => {
    this.onMouseMoveHandler(PointerEventMapper.touchEventMapper(event) as KonvaPointerEvent)
  }

  onTouchUpHandler = (event: TouchEvent): void => {
    this.onMouseUpHandler(PointerEventMapper.touchEventMapper(event) as KonvaPointerEvent)
  }

  get stageNode () {
    return this.$refs.stage.getNode()
  }

  get layerNode () {
    return this.$refs.layer.getNode()
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
  &.freedraw::v-deep canvas {
    cursor: url('~@/assets/cursor/pen.png'), auto;
  }
  &.erase::v-deep canvas {
    cursor: url('~@/assets/cursor/eraser.png'), auto;
  }
  &.circle::v-deep canvas {
    cursor: url('~@/assets/cursor/circle.png'), auto;
  }
  /* Extra Tools Here */
}
</style>
