<template>
  <div class="full-width-height"
       ref="app"
       @mousedown="canvasDown"
       @mousemove="canvasMove"
       @mouseup="canvasUp"
  >
    <the-canvas ref="stage" :id="id"/>
    <the-nav-large class="the-nav-large" :id="id"/>
    <the-nav-small class="the-nav-small" :id="id"/>
    <the-tool-panel class="custom-hide-on-mobile" :id="id"/>
    <the-entity-panel  class="custom-hide-on-mobile" :id="id"/>
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

const Socket = namespace(Namespaces.SOCKET)

  @Component({
    name: 'Room',
    components: {
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

  created () {
    this.socket.onopen = () => {
      // eslint-disable-next-line @typescript-eslint/camelcase
      this.socket.send(JSON.stringify({ join_room: this.id }))
    }
  }

  canvasDown (e: MouseEvent) {
    if (e.target === this.$refs.app && !(e.target instanceof HTMLCanvasElement)) {
      EventBus.$emit('mouseDown', e)
<<<<<<< HEAD
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
=======
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
>>>>>>> 2918629cd00572446ce3a1f6b1da67e016485c77
}
</script>
<style scoped lang="scss">
  .full-width-height {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
  }

  @media (max-width: 599px) {
    .custom-hide-on-mobile {
      display: none;
    }
  }

  @media (max-height: 300px) {
    .custom-hide-on-mobile {
      display: none;
    }
  }

  @media (max-width: 1199px) {
    .the-nav-large {
      display: none;
    }
  }

  @media (min-width: 1200px) {
    .the-nav-small {
      display: none;
    }
  }
</style>
