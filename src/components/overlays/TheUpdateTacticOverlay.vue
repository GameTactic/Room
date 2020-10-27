<template>
  <tactic-content
    :overlay="overlay"
    :tactic="selectedTactic"
    :search="search"
    :maps="maps"
    title="tactic.updateTacticOverlay.title"
    actionButtonTitle="tactic.updateTacticOverlay.update"
    @tacticNameOnChangeHandler="selectedTactic.name = $event"
    @tacticMapOnChangeHandler="selectedTactic.map = $event"
    @searchInputOnChangeHandler="search = $event"
    @actionButtonOnClickHandler="updateTacticOnClickHandler"
    @overlayOnChangeHandler="overlay = $event"
  />
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { EventBus } from '@/event-bus'
import { AppRoomGetters } from '@/store/modules/app/room'
import { namespace } from 'vuex-class'
import { Api, Game, Tactic } from '@/store/types'
import { SocketStageActions } from '@/store/modules/socket/stage'
import { CustomStageConfig } from '@/util/pointerEventMapper'
import { SocketCanvasAction } from '@/store/modules/socket/canvas'
import { CanvasElement, CanvasElementHistory } from '@/types/canvas'
import TacticWatcher from '@/mixins/tacticWatcher'
import { Namespaces } from '@/store'
import { MapsDataApi } from '@/types/games/wows'
import { SocketTacticAction } from '@/store/modules/socket/tactic'
import { GameApiRoutes } from '@/games/utils'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import { OpenOverlayList } from './types'
import TacticContent from './TacticContent.vue'

const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
const AppRoom = namespace(Namespaces.APP_ROOM)
const SocketStage = namespace(Namespaces.SOCKET_STAGE)
const SocketCanvas = namespace(Namespaces.SOCKET_CANVAS)
const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)

@Component({
  name: 'TheUpdateTacticOverlay',
  mixins: [TacticWatcher],
  components: { TacticContent }
})
export default class TheUpdateTacticOverlay extends mixins(TacticWatcher) {
  @AppRoom.Getter(AppRoomGetters.API) api!: Api[]
  @SocketStage.Action(SocketStageActions.SET_CONFIG) setConfig!: (config: CustomStageConfig) => void
  @SocketCanvas.Action(SocketCanvasAction.SET_CANVAS_ELEMENT) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @SocketCanvas.Action(SocketCanvasAction.SET_CANVAS_ELEMENT_HISTORY) setCanvasElementsHistory!: (canvasElements: CanvasElementHistory[]) => void
  @SocketTactic.Action(SocketTacticAction.UPDATE_TACTIC) updateTactic!: (tactic: Tactic) => void
  @SocketRoom.Getter(SocketRoomGetters.GAME) currentGame!: Game

  search = ''
  selectedTactic: Tactic | null = null
  overlay = false

  created () {
    EventBus.$on(OpenOverlayList.OPEN_THE_UPDATE_TACTIC_OVERLAY, (tactic: Tactic) => {
      this.overlay = true
      this.selectedTactic = { ...tactic }
    })
  }

  get maps () {
    const mapApi: Api | undefined = this.api.find((api: Api) => (this.currentGame !== Game.NONE) && api.name === GameApiRoutes[this.currentGame].maps)
    return mapApi ? (mapApi.data as MapsDataApi).maps : false
  }

  $refs!: {
    img: HTMLImageElement;
    imgName: HTMLHeadingElement;
  }

  // Need to do more to this, but we dont have the collection stuff created yet so this is temporary.
  updateTacticOnClickHandler (): void {
    if (this.selectedTactic && Object.keys(this.selectedTactic).length) {
      this.updateTactic(this.selectedTactic as Tactic)
      this.resetTacticForm()
    }
    this.overlay = false
  }

  resetTacticForm () {
    this.$data.tactic = {
      map: {
        name: '',
        icon: '',
        desc: '',
        width: 1,
        height: 1,
        ratio: 0,
        id: 0
      },
      name: ''
    }
  }
}
</script>
