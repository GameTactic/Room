import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'

export default class Erase implements Tool {
  // eslint-disable-next-line no-useless-constructor
  constructor (public readonly name: string) {
  }
  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, CanvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
  // TODO: Remove clicked layer
  }

  // eslint-disable-next-line
  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
  // TODO: Render eraser
  }

  sendToWebsockets = (socket: WebSocket, canvasElement: CanvasElement) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: uuid(),
      layerId: canvasElement.layerId,
      tool: {
        name: 'erase'
      },
      temporary: true,
      data: canvasElement.data
    }
    socket.send(JSON.stringify(data))
  }
}