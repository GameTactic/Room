import Component from 'vue-class-component'
import Vue from 'vue'
import { Tactic } from '@/store/types'
import { Socket } from 'vue-socket.io-extended'
import { SocketCanvasTacticEmit } from '@/store/modules/socket'
import HandleTactic from '@/util/HandleTactic'

@Component({
  name: 'TacticWatcher'
})
export default class TacticWatcher extends Vue {
  // This is for presentation mode
  @Socket(SocketCanvasTacticEmit.CANVAS_TACTIC_SWITCH_TACTIC)
  onChangeTactic (tactic: Tactic[]) {
    new HandleTactic(tactic[0]).setLocal()
  }
}
