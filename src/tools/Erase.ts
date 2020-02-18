import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElementPayload, CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'

export default class Erase implements Tool {
  // eslint-disable-next-line no-useless-constructor
  constructor (public readonly name: string) {
  }
  // eslint-disable-unused-parameters
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElementPayload: CanvasElementPayload, layer: Konva.Layer, socket: WebSocket): void => {
  // TODO: Remove clicked layer
  }

  // eslint-disable.unused-paramenters
  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
  // TODO: Render eraser
  }

  sendToWebsockets = (socket: WebSocket, canvasElementPayload: CanvasElementPayload) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: uuid(),
      tool: {
        name: 'erase'
      },
      immediate: true,
      data: canvasElementPayload.data
    }
    socket.send(JSON.stringify(data))
  }
}
