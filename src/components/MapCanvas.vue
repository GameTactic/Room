<template>
  <v-stage
    ref="stage"
    class="konva-stage"
    :config="stageSize"
    @mousedown="onMouseDownHandler"
    @mouseup="onMouseUpHandler"
    @mousemove="throttledMethod"
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
const { canvasTools } = require('../mixins/canvasTools')

@Component({
  name: 'MapCanvas',
  methods: {
    throttledMethod: throttle(function (this: any, e:any) {
      this.onMouseMoveHandler(e)
    }, 75)
  }
})

export default class MapButtons extends mixins(canvasTools) {
  @Prop() private id!: string;

  stageSize = {
    width: window.innerWidth,
    height: window.innerHeight
  }
  tools: string[] = []
  enableTool: Boolean = false
  activeTool: string = ''
  $refs!: {
    layer: any
  }

  created () {
    this.$store.subscribe((mutation: any, state: any) => {
      if (mutation.type === 'SET_TOOLS') {
        this.$data.tools = this.$store.getters.tools
        const found = this.$data.tools.find((tool: ITool) => tool.enabled)
        if (found) {
          this.$data.activeTool = found.name
        } else {
          this.$data.activeTool = ''
        }
      }
    })
    const vm = this
    window.addEventListener('resize', function (e) {
      const currentTarget = e.currentTarget as Window
      if (currentTarget) {
        vm.$data.stageSize = {
          width: currentTarget.innerWidth,
          height: currentTarget.innerHeight
        }
      }
    }, true)
  }

  beforeDestory () {
    window.removeEventListener('resize', function (e) {})
  }

  onMouseUpHandler (e: any) : void {
    this.$data.enableTool = false
  }

  onMouseDownHandler (e: any) : void {
    if (this.$data.activeTool) {
      this.$data.enableTool = true
      const layer = this.$refs.layer.getNode()
      const activeTool = this.$data.activeTool
      // @ts-ignore
      this[activeTool]().onClick(e, layer)
    }
  }

  onMouseMoveHandler (e: any) : void {
    if (this.$data.enableTool && this.$data.activeTool) {
      const layer = this.$refs.layer.getNode()
      const activeTool = this.$data.activeTool
      // @ts-ignore
      this[activeTool]().onClick(e, layer)
    }
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
