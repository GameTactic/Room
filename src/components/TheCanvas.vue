<template>
  <v-stage
    ref="stage"
    class="konva-stage"
    :config="stageSize"
    @mousedown="onMouseDownHandler"
    @mouseup="onMouseUpHandler"
    @mousemove="throttleToolRender"
  >
    <v-layer ref="layer" />
  </v-stage>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import Component, { mixins } from 'vue-class-component'
import { ITool } from '../types/canvas'
import Konva from 'konva'
import throttle from 'lodash.throttle'
import { KonvaNodeEvent } from 'konva/types/types'
const { canvasTools } = require('../mixins/canvasTools')

interface IVmThis {
    [key: string]: any;
}

@Component({
  name: 'TheCanvas',
  methods: {
    throttleToolRender: throttle(function (this: any, e:any, websocket: boolean = false) {
      if (!websocket) {
        this.onMouseMoveHandler(e)
      } else {
        this.onWebSocketHandler(e)
      }
    }, 75)
  }
})

export default class TheCanvas extends mixins(canvasTools) {
  @Prop() private id!: string;

  stageSize = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  enabledTool: string = ''
  enabled: boolean = false
  tools: ITool[] = []
  $refs!: {
    layer: any
  }

  created () {
    let vm: IVmThis = this
    vm.$data.tools = vm.$store.getters.tools
    vm.$store.subscribe((mutation: any, state: any) => {
      if (mutation.type === 'SET_ENABLED_TOOL') {
        vm.$data.enabledTool = vm.$store.getters.enabledTool
      } else if (mutation.type === 'SET_DISABLED_TOOL') {
        vm.$data.enabledTool = ''
      } else if (mutation.type === 'SET_ENABLED') {
        vm.$data.enabled = true
      } else if (mutation.type === 'SET_DISABLED') {
        vm.$data.enabled = false
      }
    })
    window.addEventListener('resize', (e) => {
      const currentTarget = e.currentTarget as Window
      if (currentTarget) {
        vm.$data.stageSize = {
          width: currentTarget.innerWidth,
          height: currentTarget.innerHeight
        }
      }
    }, true)
    vm.$socket.onmessage = (data: any) => {
      try {
        const receivedData = JSON.parse(data.data)
        if (receivedData.type && receivedData.data.e) {
          vm.$data.enabledTool = receivedData.type
          vm.throttleToolRender(receivedData.data.e, true)
        }
      } catch (err) {
        console.error(err.message)
      }
    }
  }

  beforeDestroy () {
    window.removeEventListener('resize', (e: any) => {})
  }

  webSocketSendData (enabledTool: string, e: any) {
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

  onMouseUpHandler (e: any) : void {
    this.$store.dispatch('setDisabled')
  }

  onMouseDownHandler (e: any) : void {
    let vm: IVmThis = this
    const enabledTool = vm.$data.enabledTool
    vm.$store.dispatch('setEnabled')
    if (enabledTool) {
      vm[enabledTool]().onClick(e, vm.$refs.stage.getNode(), vm.$refs.layer.getNode(), this.$store.getters.tool(enabledTool))
      vm.$socket.send(this.webSocketSendData(enabledTool, e))
    }
  }

  onMouseMoveHandler (e: any) : void {
    let vm: IVmThis = this
    const enabledTool = vm.$data.enabledTool
    if (enabledTool && vm.$data.enabled) {
      vm[enabledTool]().onClick(e, vm.$refs.stage.getNode(), vm.$refs.layer.getNode(), this.$store.getters.tool(enabledTool))
      vm.$socket.send(this.webSocketSendData(enabledTool, e))
    }
  }

  onWebSocketHandler (e: Event) : void {
    let vm: IVmThis = this
    const enabledTool = vm.$data.enabledTool
    const layer = vm.$refs.layer.getNode()
    // vm[enabledTool]().onClick(e, layer, this.$store.getters.tool(enabledTool))
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
