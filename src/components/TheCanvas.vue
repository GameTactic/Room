<template>
  <v-stage
    ref="stage"
    class="konva-stage"
    :class="[enabledTool ? enabledTool.name : '']"
    :config="stageSize"
    @mousedown="onMouseDownHandler"
    @mouseup="onMouseUpHandler"
    @mousemove="onMouseMoveHandler"
  >
    <v-layer ref="layer" :config="{ id: canvasElement.layerId }" />
  </v-stage>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { Tool } from '@/tools/Tool'
import { VueKonvaLayer, VueKonvaStage, CanvasElement } from '@/types/Canvas'
import Vue from 'vue'
import { Namespaces } from '@/store'
import { Action, Getter, namespace } from 'vuex-class'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'
import { CanvasAction, CanvasGetters } from '@/store/modules/canvas'
import Konva from 'konva'
import { SocketActions, SocketGetters } from '@/store/modules/socket'

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
    @Action(`canvas/${CanvasAction.REMOVE_CANVAS_ELEMENT}`) removeCanvasElement!: (id: string) => void
    @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS}`) canvasElements!: CanvasElement[]

    stageSize = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    canvasElement: CanvasElement = {
      jti: 'SAM',
      id: '',
      data: [],
      tool: {
        name: '',
        colour: '',
        size: 0
      },
      temporary: false,
      layerId: Math.random().toString(36)
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

      this.socket.onmessage = (data: MessageEvent) => {
        try {
          const canvasElement: CanvasElement = JSON.parse(data.data).payload
          if (canvasElement.layerId !== this.$data.canvasElement.layerId) {
            if (canvasElement.temporary) {
              const foundTool = this.tools.find((tool: Tool) => tool.name === canvasElement.tool.name)
              if (foundTool && foundTool.renderCanvas) {
                foundTool.renderCanvas(canvasElement, this.layerNode)
              }
            } else {
              this.addCanvasElement(canvasElement)
              this.renderShapes()
            }
          }
        } catch (err) { }
      }
    }

    beforeDestroy () {
      window.removeEventListener('resize', () => null)
    }

    renderShapes (): void {
      this.canvasElements.forEach((canvasElement: CanvasElement) => {
        if (canvasElement.tool.renderCanvas && !this.layerNode.find((shape: Konva.Shape) => shape.attrs.id === canvasElement.id).length) {
          canvasElement.tool.renderCanvas(canvasElement, this.layerNode)
        }
      })
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
        if (!this.enabledTool.temporary) {
          if (this.enabledTool.name === 'erase') {
            this.removeCanvasElement(this.$data.canvasElement.id)
          } else {
            this.addCanvasElement({
              ...this.$data.canvasElement,
              tool: { ...this.enabledTool },
              temporary: false
            })
          }
        }
        this.renderShapes()
      }
    }

    get stageNode () {
      return this.$refs.stage.getNode()
    }

    get layerNode () {
      return this.$refs.layer.getNode()
    }
}
</script>
<style scoped lang="scss">
  .konva-stage {
    background-color: white;
    position: absolute;
    /* These are FA icons and might need replacing. */
    &.ping::v-deep canvas {
      cursor: pointer;
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
