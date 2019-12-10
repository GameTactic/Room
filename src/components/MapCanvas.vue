<template>
  <v-stage
    ref="stage"
    class="konva-stage"
    :config="stageSize"
    :onMouseDown="onMouseDownHandler"
    :onMouseUp="onMouseUpHandler"
    @mousemove="throttledMethod"
  >
    <v-layer ref="layer" />
  </v-stage>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import { ITool } from '../types/canvas'
import Konva from 'konva'
import _ from 'lodash'
import { addPing } from './ping'

@Component({
  name: 'MapCanvas',
  data () {
    return {
      stageSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      tools: [],
      showPing: false,
      activeTool: ''
    }
  },
  created () {
    this.$store.subscribe((mutation: any, state: any) => {
      if (mutation.type === 'SET_TOOLS') {
        this.$data.tools = this.$store.getters.tools
        const found = this.$data.tools.find((tool: ITool) => tool.enabled)
        if (found) {
          this.$data.showPing = false
          this.$data.activeTool = found.name
        } else {
          this.$data.activeTool = ''
        }
      }
    })
  },
  methods: {
    // UNCOMMENT AND PLEASE STOP THIS FROM COMPLAINING
    /*
      Property 'throttledMethod' is incompatible with index signature.
      Type '((this: never, e: any) => void) & Cancelable' is not assignable to type '(this: Vue, ...args: any[]) => any'.
      The 'this' types of each signature are incompatible.
        Type 'Vue' is not assignable to type 'never'.
    */
    // throttledMethod: _.throttle(function (e) {
    //   this.onMouseMoveHandler(e)
    // }, 75),
    onMouseUpHandler (e: any) : void {
      // @ts-ignore - property 'getNode' does not exist on type 'Vue | Element | Vue[] | Element[]'
      const layer = this.$refs.layer.getNode()
      switch (this.$data.activeTool) {
        case 'ping':
          this.$data.showPing = false
          break
      }
    },
    onMouseDownHandler (e: any) : void {
      // @ts-ignore - property 'getNode' does not exist on type 'Vue | Element | Vue[] | Element[]'
      const layer = this.$refs.layer.getNode()
      switch (this.$data.activeTool) {
        case 'ping':
          this.$data.showPing = true
          addPing(e, layer)
          break
      }
    },
    onMouseMoveHandler (e:any) : void {
      // @ts-ignore - property 'getNode' does not exist on type 'Vue | Element | Vue[] | Element[]'
      const layer = this.$refs.layer.getNode()
      switch (this.$data.activeTool) {
        case 'ping':
          if (this.$data.showPing) {
            addPing(e, layer)
            break
          }
      }
    }
  }
})
export default class MapButtons extends Vue {
  @Prop() private id!: string;
}
</script>
<style scoped lang="scss">
.konva-stage {
  background-color: white;
  width: 100%;
  height: 100%;
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
