import Component from 'vue-class-component'
import Vue from 'vue'
import { Tactic } from '@/store/modules/types'
import { Socket } from 'vue-socket.io-extended'
import { CanvasAction } from '@/store/modules/canvas'
import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import { Action } from 'vuex-class'
import { StageActions } from '@/store/modules/stage'
import HandleRenderShapes from '@/util/HandleRenderShapes'

@Component({
  name: 'StageWatch'
})
export default class TacticWatcher extends Vue {
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT}`) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT_HISTORY}`) setCanvasElementsHistory!: (canvasElements: CanvasElementHistory[]) => void
  @Action(`stage/${StageActions.SET_STAGE_TACTIC}`) setStageTactic!: (tactic: Tactic) => void

  @Socket('canvasChangeTactic')
  onChangeTactic (tactic: Tactic[]) {
    if (this.validateTactic(tactic[0])) {
      this.changeTactic(tactic[0])
    }
  }

  changeTactic (tactic: Tactic) {
    this.setCanvasElements(tactic.canvasElements)
    this.setCanvasElementsHistory(tactic.canvasElementsHistory)
    this.setStageTactic(tactic)
    const renderCanvas = new HandleRenderShapes(this.$store)
    renderCanvas.handle()
  }

  newTactic (tactic: Tactic) {
    if (this.validateTactic(tactic)) {
      this.changeTactic(tactic)
      this.sendToSockets(tactic)
    }
  }

  sendToSockets (tactic: Tactic) {
    this.$socket.client.emit('canvasChangeTactic', tactic)
  }

  validateTactic (tactic: Tactic) {
    return (tactic.createdBy && tactic.name && tactic.canvasElements && tactic.canvasElementsHistory && tactic.map && tactic.collectionId)
  }
}
