<template>
  <div class="full-width-height"
    ref="app"
    @mousedown="canvasDown"
    @mousemove="canvasMove"
    @mouseup="canvasUp"
  >
    <the-canvas v-if="loadCanvas" ref="stage" :id="id" :prop-stage-config="stageConfig"/>
    <the-nav-large class="the-nav-large" :id="id"/>
    <the-nav-small class="the-nav-small" :id="id"/>
    <the-tool-panel class="custom-hide-on-mobile" :id="id"/>
    <the-entity-panel  class="custom-hide-on-mobile" :id="id"/>
    <the-create-new-tactic-overlay :id="id" />
  </div>
</template>

<script lang="ts">
import TheNavLarge from '@/components/navigation/TheNavLarge.vue'
import TheNavSmall from '@/components/navigation/TheNavSmall.vue'
import TheToolPanel from '@/components/TheToolPanel.vue'
import TheCanvas from '@/components/TheCanvas.vue'
import TheEntityPanel from '@/components/TheEntityPanel.vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { EventBus } from '@/event-bus'
import { VueKonvaStage } from '@/types/Canvas'
import TheCreateNewTacticOverlay from '@/components/overlays/TheCreateNewTacticOverlay.vue'
import { Map } from '@/store/modules/room'

const Socket = namespace(Namespaces.SOCKET)

  @Component({
    name: 'Room',
    components: {
      TheCreateNewTacticOverlay,
      TheNavLarge,
      TheNavSmall,
      TheToolPanel,
      TheCanvas,
      TheEntityPanel
    }
  })
export default class extends Vue {
  @Prop() id!: string
  @Socket.Getter('socket') socket!: WebSocket

  $refs!: {
    app: HTMLDivElement;
    stage: VueKonvaStage;
  }

  loadCanvas = false

  stageConfig = {
    scale: {
      x: 1,
      y: 1
    },
    width: 760,
    height: 760,
    initialWidth: 760,
    initialHeight: 760,
    mapSrc: 'https://glossary-wows-global.gcdn.co/icons//spaces/10_NE_big_race_minimap_combined_e163008b1c4bdae55455ac62d7553402cae05ed662d62282aa842022aea767ba.png'
  }

  created () {
    this.socket.onopen = () => {
      // eslint-disable-next-line @typescript-eslint/camelcase
      this.socket.send(JSON.stringify({ join_room: this.id }))
    }

    EventBus.$on('createTactic', (tactic: Tactic) => {
      this.stageConfig.mapSrc = tactic.map.icon
      this.loadCanvas = true
    })
  }

  canvasDown (e: MouseEvent) {
    if (e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
      EventBus.$emit('mouseDown', e)
    }
  }

  canvasMove (e: MouseEvent) {
    if (e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
      EventBus.$emit('mouseMove', e)
    }
  }

  canvasUp (e: MouseEvent) {
    if (e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
      EventBus.$emit('mouseUp', e)
    }
  }
}
export interface Tactic {
  name: string;
  map: Map;
}
</script>
<style scoped lang="scss">
  .full-width-height {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  @media (max-width: 899px) {
    .custom-hide-on-mobile {
      display: none;
    }
  }

  @media (max-width: 899px) {
    .the-nav-large {
      display: none;
    }
  }

  @media (min-width: 900px) {
    .the-nav-small {
      display: none;
    }
  }
</style>
