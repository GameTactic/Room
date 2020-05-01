<template>
  <div
    :class="`full-width-height ${dragEnabled ? 'dragEnabled' : ''}`"
    ref="app"
    @mousedown="canvasDown"
    @mousemove="canvasMove"
    @mouseup="canvasUp"
  >
    <the-canvas v-if="loadCanvas" ref="stage" :id="id"/>
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
import { Prop, Watch } from 'vue-property-decorator'
import Vue from 'vue'
<<<<<<< HEAD
import { Action, Getter, namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { EventBus } from '@/event-bus'
import { CanvasElement, VueKonvaStage } from '@/types/Canvas'
import TheCreateNewTacticOverlay from '@/components/overlays/TheCreateNewTacticOverlay.vue'
import { Map } from '@/store/modules/room'
import { StageActions, StageGetters } from '@/store/modules/stage'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import { CanvasAction } from '@/store/modules/canvas'
=======
import { namespace, Action } from 'vuex-class'
import { Namespaces } from '@/store'
import { EventBus } from '@/event-bus'
import { VueKonvaStage } from '@/types/Canvas'
import { AuthenticationGetters, ExtendedJWT } from '@/store/modules/authentication'
import { Socket } from 'vue-socket.io-extended'
>>>>>>> 66ac79f6fb7b44dd8bc81efc881fc6cf04c6f9da

const authNamespace = namespace(Namespaces.AUTH)

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
<<<<<<< HEAD
  @Socket.Getter('socket') socket!: WebSocket
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT}`) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT_HISTORY}`) setCanvasElementsHistory!: (canvasElements: CanvasElement[]) => void
  @Getter(`stage/${StageGetters.STAGE_CONFIG}`) stageConfig!: CustomStageConfig
  @Action(`stage/${StageActions.SET_MAP_SRC}`) setMapSrc!: (mapSrc: string) => void
  @Action(`stage/${StageActions.SET_CONFIG}`) setConfig!: (config: CustomStageConfig) => void
=======
  @authNamespace.Getter(AuthenticationGetters.IS_AUTH) isAuth!: boolean
  @authNamespace.Getter(AuthenticationGetters.JWT) jwt!: ExtendedJWT
  @Action('socket/joinRoom') joinRoom!: (id: string) => void
  @Socket() // --> listens to the event by method name, e.g. `connect`
  connect () {
    // eslint-disable-next-line
    console.log('connection established')
    this.joinRoom(this.id)
  }
>>>>>>> 66ac79f6fb7b44dd8bc81efc881fc6cf04c6f9da

  $refs!: {
    app: HTMLDivElement;
    stage: VueKonvaStage;
  }
  loadCanvas = true
  dragEnabled = false

  created () {
    this.initialiseSocketIO(this.isAuth)
  }

  @Watch('isAuth')
  onPropertyChanged (isAuth: boolean) {
    this.initialiseSocketIO(isAuth)
  }

  initialiseSocketIO (isAuth?: boolean) {
    if (isAuth) {
      // start socket.io with registered user
      this.$socket.client.io.opts.query = { Authorization: this.jwt.encoded } // First set the token.
      this.$socket.client.open() // Then open the socket and use it anywhere else.
    } else {
      // start socket.io with anonymous user
    }

    EventBus.$on('createTactic', (tactic: Tactic) => {
      this.setCanvasElements([])
      this.setCanvasElementsHistory([])
      this.setConfig({
        scale: {
          x: 1,
          y: 1
        },
        height: 760,
        width: 760,
        initialWidth: 760,
        initialHeight: 760,
        mapSrc: tactic.map.icon,
        mapRatio: tactic.map.ratio
      })
      this.loadCanvas = true
      EventBus.$emit('newTactic')
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
