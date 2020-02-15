<template>
  <v-stage
    ref="stage"
    class="konva-stage"
    :config="stageSize"
    @mousedown="onMouseDownHandler"
    @mouseup="onMouseUpHandler"
    @mousemove="throttleToolRender"
  >
    <v-layer ref="layer"/>
  </v-stage>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-this-alias */

import { Prop } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { Tool } from '@/tools/Tool'
import throttle from 'lodash.throttle'
import Vue from 'vue'
import { Namespaces } from '@/store'
import { Action, Getter, namespace } from 'vuex-class'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'
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
    @Action(`tools/${ToolsAction.ENABLE_TOOL}`) enableTool !: (name: string) => void
    @Getter(`tools/${ToolGetters.ENABLED}`) enabled!: boolean
    @Getter(`tools/${ToolGetters.TOOLS}`) tools!: Tool[]
    @Getter(`tools/${ToolGetters.ACTIVE_TOOL}`) activeTool!: Tool
    @Sockets.Getter(SocketGetters.SOCKET) socket!: WebSocket
    @Sockets.Action(SocketActions.SEND_IF_OPEN) send!: (message: string) => void

    stageSize = {
      width: window.innerWidth,
      height: window.innerHeight
    }
    $refs!: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      layer: any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stage: any;
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
          const receivedData = JSON.parse(data.data).payload
          if (receivedData.type && receivedData.data.e) {
            this.enableTool(receivedData.type)
            this.throttleToolRender(receivedData.data.e, true)
          }
        } catch (err) {
        }
      }
    }

    beforeDestroy () {
      window.removeEventListener('resize', () => null)
    }

    webSocketSendData (enabledTool: string, e: Konva.KonvaPointerEvent) {
      return JSON.stringify({
        type: enabledTool,
        data: {
          e: {
            evt: {
              x: e.evt.x,
              y: e.evt.y
            }
          }
        }
      })
    }

    onMouseUpHandler (): void {
      if (this.enabled) {
        this.disable()
      }
    }

    onMouseDownHandler (e: Konva.KonvaPointerEvent): void {
      if (this.activeTool) {
        this.activeTool.stop(e, this.stageNode, this.layerNode)
        this.enable()
        this.socket.send(this.webSocketSendData(this.activeTool.name, e))
      }
    }

    onMouseMoveHandler (e: Konva.KonvaPointerEvent): void {
      if (this.activeTool && this.enabled) {
        this.activeTool.action(e, this.stageNode, this.layerNode)
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(this.webSocketSendData(this.activeTool.name, e))
        }
      }
    }

    onWebSocketHandler (e: Event): void {
      this.activeTool.action(e as unknown as Konva.KonvaPointerEvent, this.stageNode, this.layerNode)
    }

    throttleToolRender = throttle((e: Event, websocket = false) => {
      if (!websocket) {
        this.onMouseMoveHandler(e as unknown as Konva.KonvaPointerEvent)
      } else {
        this.onWebSocketHandler(e)
      }
    }, 75)

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
