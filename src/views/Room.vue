<template>
  <div
    :class="`full-width-height ${dragEnabled ? 'dragEnabled' : ''}`"
    ref="app"
    @mousedown="canvasDown"
    @mousemove="canvasMove"
    @mouseup="canvasUp"
    @dragstart="onDragStartHandler"
    @dragenter="onDragEnterHandler"
    @dragover="onDragOverHandler"
    @dragend="onDragEndHandler"
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

  dragEnabled = false

  created () {
    this.socket.onopen = () => {
      // eslint-disable-next-line @typescript-eslint/camelcase
      this.socket.send(JSON.stringify({ join_room: this.id }))
    }
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

  onDragStartHandler (e: any) {
    e.dataTransfer.effectAllowed = 'copyMove'
    const image = document.createElement('img')
    image.src = e.srcElement?.dataset?.image
    // console.log('image', image.src)
    e.dataTransfer.setDragImage(image, 0, 0)
    // console.log('e.dataTransfer', e.dataTransfer)
  }

  onDragEnterHandler (e: any) {
    e.dataTransfer.dropEffect = 'copy'
    this.dragEnabled = true
  }

  onDragOverHandler (e: any) {
    e.preventDefault()
  }

  onDragEndHandler (e: DragEvent) {
    this.dragEnabled = false
    EventBus.$emit('entityDragEnd', e)
  }
}
</script>
<style scoped lang="scss">
  .full-width-height {
    width: 100%;
    height: 100%;
    overflow-x: hidden;

    &.dragEnabled::v-deep {
      cursor: move !important;
    }
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
