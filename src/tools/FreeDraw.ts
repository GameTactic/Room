import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'
import FreedrawCreator from '@/tools/shapes/FreedrawCreator'

export default class FreeDraw implements Tool {
  private freedrawCreator: FreedrawCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean) {
    this.freedrawCreator = new FreedrawCreator()
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    canvasElement.tool = {
      name: this.name,
      size: this.size,
      colour: this.colour
    }
    this.freedrawCreator = new FreedrawCreator(this.size, this.colour)
    this.freedrawCreator.create(canvasElement, layer)
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
    this.freedrawCreator.move(canvasElement, layer)
    layer.batchDraw()
  }, 0)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, _layer: Konva.Layer, socket: WebSocket): void => {
    this.sendToWebSocket(canvasElement, socket)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.freedrawCreator = new FreedrawCreator(
      canvasElement.tool.size || this.size,
      canvasElement.tool.colour || this.colour
    )
    this.freedrawCreator.create(canvasElement, layer)
    layer.batchDraw()
  }

  sendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'freedraw',
        colour: this.colour,
        size: this.size
      },
      temporary: this.temporary,
      data: canvasElement.data
    }
    socket.send(JSON.stringify(data))
  }
}
