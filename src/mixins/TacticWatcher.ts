import Component from 'vue-class-component'
import Vue from 'vue'
import { Tactic, Team } from '@/store/types'
import { Socket } from 'vue-socket.io-extended'
import { SocketCanvasAction } from '@/store/modules/socket/canvas'
import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import { namespace } from 'vuex-class'
import { SocketStageActions } from '@/store/modules/socket/stage'
import { AppLayerActions } from '@/store/modules/app/layer'
import { SocketActions, SocketCanvasTacticEmit } from '@/store/modules/socket'
import { EventBus } from '@/event-bus'
import { SocketTacticAction, SocketTacticGetters } from '@/store/modules/socket/tactic'
import { AppRoomAction } from '@/store/modules/app/room'
import { Namespaces } from '@/store'
import { SocketTeamAction } from '@/store/modules/socket/team'

const AppLayer = namespace(Namespaces.APP_LAYER)
const AppRoom = namespace(Namespaces.APP_ROOM)
const SocketCanvas = namespace(Namespaces.SOCKET_CANVAS)
const SocketStage = namespace(Namespaces.SOCKET_STAGE)
const SocketNamespace = namespace(Namespaces.SOCKET)
const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)
const SocketTeam = namespace(Namespaces.SOCKET_TEAM)

@Component({
  name: 'TacticWatcher'
})
export default class TacticWatcher extends Vue {
  @SocketCanvas.Action(SocketCanvasAction.SET_CANVAS_ELEMENT) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @SocketCanvas.Action(SocketCanvasAction.SET_CANVAS_ELEMENT_HISTORY) setCanvasElementsHistory!: (canvasElements: CanvasElementHistory[]) => void
  @AppLayer.Action(AppLayerActions.LAYER_CLEAR) layerClear!: () => void
  @AppRoom.Action(AppRoomAction.SET_IS_CANVAS_LOADED) setIsCanvasLoaded!: (isCanvasLoaded: boolean) => void
  @SocketNamespace.Action(SocketActions.EMIT) emit!: (payload: { data: object; emit: string }) => void
  @SocketStage.Action(SocketStageActions.SET_STAGE_TACTIC) setStageTactic!: (tactic: Tactic) => void
  @SocketTactic.Action(SocketTacticAction.SET_CURRENT_TACTIC_ID) setCurrentTacticId!: (id: string) => void
  @SocketTactic.Action(SocketTacticAction.ADD_TACTIC) addTactic!: (tactic: Tactic) => void
  @SocketTactic.Action(SocketTacticAction.UPDATE_TACTIC) updateTactic!: (tactic: Tactic) => void
  @SocketTactic.Getter(SocketTacticGetters.TACTICS) tactics!: Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.CURRENT_TACTIC_ID) currentTacticId!: string
  @SocketTeam.Action(SocketTeamAction.SET_TEAMS) setTeams!: (teams: Team[]) => void
  @SocketTeam.Action(SocketTeamAction.SET_SELECTED_TEAM) setSelectedTeam!: (team: Team) => void

  created () {
    EventBus.$on('setTactic', (tactic: Tactic | string) => {
      if (typeof (tactic) === 'object') {
        this.changeTactic(tactic)
      } else {
        const foundTactic: Tactic | undefined = this.tactics.find((t: Tactic) => t.id === tactic)
        if (foundTactic) {
          this.changeTactic(foundTactic)
        }
      }
    })

    EventBus.$on('newTactic', (tactic: Tactic) => {
      this.newTactic(tactic)
    })
  }

  // This is for presentation mode
  @Socket(SocketCanvasTacticEmit.CANVAS_TACTIC_SWITCH_TACTIC)
  onChangeTactic (tactic: Tactic[]) {
    if (this.validateTactic(tactic[0])) {
      this.changeTactic(tactic[0])
    }
  }

  changeTactic = (tactic: Tactic): boolean => {
    if (tactic.id !== this.currentTacticId) {
      this.setTeams(tactic.teams)
      this.setSelectedTeam(tactic.teams[0])
      this.setCanvasElements(tactic.canvasElements)
      this.setCanvasElementsHistory(tactic.canvasElementsHistory)
      this.setStageTactic(tactic)
      this.setCurrentTacticId(tactic.id)
      this.layerClear()
      return true
    } else {
      return false
    }
  }

  newTactic (tactic: Tactic) {
    if (this.validateTactic(tactic) && this.changeTactic(tactic)) {
      this.addTactic(tactic)
      this.setIsCanvasLoaded(true)
    }
  }

  sendToSockets (tactic: Tactic) {
    this.emit({ data: tactic, emit: SocketCanvasTacticEmit.CANVAS_TACTIC_SWITCH_TACTIC })
  }

  validateTactic (tactic: Tactic) {
    return (tactic.createdBy &&
      tactic.name &&
      tactic.canvasElements &&
      tactic.canvasElementsHistory &&
      tactic.map &&
      tactic.collectionId &&
      tactic.teams.length > 0
    )
  }
}
