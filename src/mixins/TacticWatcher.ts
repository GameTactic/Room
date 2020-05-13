import Component from 'vue-class-component'
import Vue from 'vue'
import { Tactic } from '@/store/modules/types'
import { Socket } from 'vue-socket.io-extended'
import { CanvasAction } from '@/store/modules/canvas'
import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import { Action } from 'vuex-class'
import { StageActions } from '@/store/modules/stage'
import { LayerActions } from '@/store/modules/layer'
import { SocketActions, SocketCanvasTacticEmit } from '@/store/modules/socket'

@Component({
  name: 'StageWatch'
})
export default class TacticWatcher extends Vue {
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT}`) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT_HISTORY}`) setCanvasElementsHistory!: (canvasElements: CanvasElementHistory[]) => void
  @Action(`stage/${StageActions.SET_STAGE_TACTIC}`) setStageTactic!: (tactic: Tactic) => void
  @Action(`layer/${LayerActions.LAYER_CLEAR}`) layerClear!: () => void
  @Action(`socket/${SocketActions.EMIT}`) emit!: (payload: { data: object; emit: string }) => void

  @Socket(SocketCanvasTacticEmit.CANVAS_TACTIC_SWITCH_TACTIC)
  onChangeTactic (tactic: Tactic[]) {
    if (this.validateTactic(tactic[0])) {
      this.changeTactic(tactic[0])
    }
  }

  changeTactic (tactic: Tactic) {
    this.setCanvasElements(tactic.canvasElements)
    this.setCanvasElementsHistory(tactic.canvasElementsHistory)
    this.setStageTactic(tactic)
    this.layerClear()
  }

  newTactic (tactic: Tactic) {
    if (this.validateTactic(tactic)) {
      this.changeTactic(tactic)
      this.sendToSockets(tactic)
    }
  }

  sendToSockets (tactic: Tactic) {
    this.emit({ data: tactic, emit: SocketCanvasTacticEmit.CANVAS_TACTIC_SWITCH_TACTIC })
  }

  validateTactic (tactic: Tactic) {
    return (tactic.createdBy && tactic.name && tactic.canvasElements && tactic.canvasElementsHistory && tactic.map && tactic.collectionId)
  }
}
