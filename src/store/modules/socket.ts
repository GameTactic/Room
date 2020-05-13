import { Module, ActionContext } from 'vuex'

export enum SocketCanvasToolsEmit {
  CANVAS_TOOLS_CIRCLE = 'canvasToolsCircle',
  CANVAS_TOOLS_ENTITY = 'canvasToolsEntity',
  CANVAS_TOOLS_ERASE = 'canvasToolsErase',
  CANVAS_TOOLS_FREE_DRAW = 'canvasToolsFreeDraw',
  CANVAS_TOOLS_LINE = 'canvasToolsLine',
  CANVAS_TOOLS_MOVE = 'canvasToolsMove',
  CANVAS_TOOLS_PING = 'canvasToolsPing',
  CANVAS_TOOLS_RULER = 'canvasToolsRuler',
  CANVAS_TOOLS_TEXT = 'canvasToolsText',
  CANVAS_TOOLS_UNDO = 'canvasToolsUndo',
  CANVAS_TOOLS_REDO = 'canvasToolsRedo'
}

export enum SocketCanvasTacticEmit {
  CANVAS_TACTIC_SWITCH_TACTIC = 'canvasTacticSwitchTactic'
}

export enum SocketRoomEmit {
  ROOM_JOIN = 'roomJoin'
}

export enum SocketRoomListen {
  ROOM_USER_JOINED = 'roomUserJoined'
}

export enum SocketActions {
  EMIT = 'emit'
}

type SocketActionContext = ActionContext<{}, {}>;

const SocketModule: Module<{}, {}> = {
  namespaced: true,
  actions: {
    [SocketActions.EMIT] (_context: SocketActionContext, payload: { data: object; emit: string }) {
      // eslint-disable-next-line
      const vm: any = this
      console.log(payload.emit)
      vm._vm.$socket.client.emit(payload.emit, payload.data)
    }
  }
}

export default SocketModule
