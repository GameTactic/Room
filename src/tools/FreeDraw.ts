import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'
import FreedrawCreator from '@/tools/shapes/FreedrawCreator'

export default class FreeDraw implements Tool {
  private freedraw: Konva.Line;
  private freedrawCreator: FreedrawCreator;
  constructor (public readonly name: string,
               public size: number,
               public colour: string) {
    this.freedraw = new Konva.Line()
    this.freedrawCreator = new FreedrawCreator()
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    this.freedrawCreator = new FreedrawCreator(this.size, this.colour)
    this.freedraw = this.freedrawCreator.create(canvasElement, layer)
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
    this.freedrawCreator.move(canvasElement, layer, this.freedraw)
    layer.batchDraw()
  }, 0)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, _layer: Konva.Layer, socket: WebSocket): void => {
    this.sendToWebsockets(socket, canvasElement)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.freedrawCreator = new FreedrawCreator(
      canvasElement.tool.size || this.size,
      canvasElement.tool.colour || this.colour
    )
    this.freedrawCreator.create(canvasElement, layer)
    layer.batchDraw()
  }

  sendToWebsockets = (socket: WebSocket, canvasElement: CanvasElement) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'freedraw',
        colour: this.colour,
        size: this.size
      },
      temporary: false,
      data: canvasElement.data
    }
    socket.send(JSON.stringify(data))
  }
}
