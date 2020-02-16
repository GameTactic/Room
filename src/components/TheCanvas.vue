<template>
  <v-stage
    ref="stage"
    class="konva-stage"
    :config="stageSize"
    @mousedown="onMouseDownHandler"
    @mouseup="onMouseUpHandler"
    @mousemove="onMouseMoveHandler"
  >
    <v-layer ref="layer"/>
  </v-stage>
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { Tool } from '@/tools/Tool'
import { VueKonvaLayer, VueKonvaStage, CanvasElementPayload, CanvasElement } from '@/types/Canvas'
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
    @Action(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT}`) addCanvasElement!: (canvasElementPayload: CanvasElementPayload) => void
    @Getter(`canvas/${CanvasGetters.CANVAS_ELEMENTS}`) canvasElements!: () => void

    stageSize = {
      width: window.innerWidth,
      height: window.innerHeight
    }

    canvasElementPayload = {
      data: [],
      tool: null
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
          if (canvasElement.immediate) {
            // render it on the canvas
            const foundTool = this.tools.find((tool: Tool) => tool.name === canvasElement.tool.name)
            if (foundTool && foundTool.renderCanvas && canvasElement.jti !== 'SAM') {
              foundTool.renderCanvas(canvasElement, this.layerNode)
            }
          } else {
            // send it to the store and then render it on canvas
            this.addCanvasElement(canvasElement)
          }
        } catch (err) { }
      }
    }

    beforeDestroy () {
      window.removeEventListener('resize', () => null)
    }

    onMouseDownHandler (e: Konva.KonvaPointerEvent): void {
      if (this.enabledTool?.mouseDownAction) {
        this.enable()
        this.enabledTool.mouseDownAction(e, this.$data.canvasElementPayload, this.layerNode, this.socket)
      }
    }

    onMouseMoveHandler (e: Konva.KonvaPointerEvent): void {
      if (this.enabledTool?.mouseMoveAction && this.enabled) {
        this.enabledTool.mouseMoveAction(e, this.$data.canvasElementPayload, this.layerNode, this.socket)
      }
    }

    onMouseUpHandler (e: Konva.KonvaPointerEvent): void {
      if (this.enabledTool?.mouseUpAction && this.enabled) {
        this.disable()
        this.enabledTool.mouseUpAction(e, this.$data.canvasElementPayload, this.layerNode, this.socket)
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
  }
</style>

<!--
Konva
1) Starts with a stage which contains multiple user Layers
2) Each Layer has 2 Canvas renderers: Scene and Hit Graph
3) The Scene layer contains what we see
4) The Hit Graph layer is hidden and used for event detection
5) Each layer can contain shapes, groups of other groups and shapes
5) The Stage, Layers and Groups are virtual nodes like DOM nodes
6) All nodes can be styled and transformed and Konva provides shapes
7) Create custom shapes by using the Shape Class and creating a draw function
-->
