<template>
  <v-stage ref="stage" :config="stageSize" class="konva-stage" :onClick="onClickHandler">
    <v-layer ref="layer" />
  </v-stage>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import Ping from './canvasElements/Ping.vue'
import { ITool } from '../types/canvas'
import Konva from 'konva'

@Component({
  name: 'MapCanvas',
  components: {
    Ping
  },
  data () {
    return {
      stageSize: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      tools: []
    }
  },
  methods: {
    onClickHandler (e:any) : void {
      // this.$store.dispatch('setCursorPosition', {
      //   x: e.evt.x,
      //   y: e.evt.y
      // })
      this.$data.tools = this.$store.getters.tools
      const found = this.$data.tools.find((tool: ITool) => tool.enabled === true)
      if (found) {
        const stage = this.$refs.stage.getStage()
        const layer = this.$refs.layer.getNode()
        switch (found.name) {
          case 'ping':
            const id = Math.random()
            const amplitude = 25
            const period = 500
            let radius = 0

            let item = new Konva.Circle({
              x: e.evt.x,
              y: e.evt.y,
              radius: radius,
              stroke: 'red',
              fill: 'white',
              strokeWidth: 5
            })

            const anim = new Konva.Animation((frame: any) => {
              radius = amplitude * Math.sin((frame.time * Math.PI) / 1000)
              layer.add(item)
            }, layer)
            anim.start()
            setTimeout(() => {
              console.log('stopped')
              radius = 0
              anim.stop()
            }, period)
            // stage.draw()
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
