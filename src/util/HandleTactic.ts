import { Tactic } from '@/store/types'
import store from '@/main'
import { Namespaces } from '@/store'
import { SocketStageActions, SocketStageGetters } from '@/store/modules/socket/stage'
import { SocketCanvasAction } from '@/store/modules/socket/canvas'
import { SocketTeamAction } from '@/store/modules/socket/team'
import { SocketTacticAction, SocketTacticGetters } from '@/store/modules/socket/tactic'
import { EventBus } from '@/event-bus'

export default class HandleTactic {
  private tactic: Tactic

  constructor (tactic: Tactic) {
    this.tactic = tactic
  }

  createNewTactic = (): void => {
    this.addTactic()
    this.setLocal()
  }

  addTactic = (): void => {
    store.dispatch(`${Namespaces.SOCKET_TACTIC}/${SocketTacticAction.ADD_TACTIC}`, this.tactic)
  }

  // This function sets clients tactic to the one provided in the constructor.
  setLocal = (): void => {
    // Before we set the local we need to get the tactic from the sockets to ensure we get the last version of it
    // Since we dont have that implemented yet, we use the tactic provided in the constructor.
    // All changes of tactics on screen should go through this function
    const currentTacticId = store.getters[`${Namespaces.SOCKET_TACTIC}/${SocketTacticGetters.CURRENT_TACTIC_ID}`]
    if (currentTacticId !== this.tactic.id) {
      this.checkNeedForOverlay()
      this.setCurrentTactic()
      this.setStage()
      this.setElements()
      this.setTeams()
      // Here we need to notify sockets that we switched tactic
    }
  }

  // This function sets every client in the rooms tactic to the one provided in the constructor
  // Use this for presentation mode
  setGlobal = (): void => {
    // TODO
  }

  setStage = (): void => {
    store.dispatch(`${Namespaces.SOCKET_STAGE}/${SocketStageActions.SET_STAGE_TACTIC}`, this.tactic)
  }

  setElements = (): void => {
    store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.SET_CANVAS_ELEMENT}`, this.tactic.canvasElements)
    store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.SET_CANVAS_ELEMENT_HISTORY}`, this.tactic.canvasElementsHistory)
  }

  setTeams = (): void => {
    store.dispatch(`${Namespaces.SOCKET_TEAM}/${SocketTeamAction.SET_TEAMS}`, this.tactic.teams)
    store.dispatch(`${Namespaces.SOCKET_TEAM}/${SocketTeamAction.SET_SELECTED_TEAM}`, this.tactic.teams[0])
  }

  setCurrentTactic = (): void => {
    store.dispatch(`${Namespaces.SOCKET_TACTIC}/${SocketTacticAction.SET_CURRENT_TACTIC_ID}`, this.tactic.id)
  }

  checkNeedForOverlay = (): void => {
    const currentMapSrc = store.getters[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_MAP_SRC}`]
    if (currentMapSrc !== this.tactic.map.icon) {
      EventBus.$emit('MapChanging', true)
    }
  }
}
