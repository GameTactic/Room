import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'
import RulerCreator from '@/tools/shapes/RulerCreator'

export default class Ruler implements Tool {
  private rulerCreator: RulerCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean) {
    this.rulerCreator = new RulerCreator(this.size, this.colour)
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    canvasElement.temporary = this.temporary
    canvasElement.tool = {
      name: this.name,
      size: this.size,
      colour: this.colour
    }
    this.rulerCreator.create(canvasElement, layer)
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    const pos = { x: e.evt.x, y: e.evt.y }
    this.rulerCreator.move(canvasElement, layer, pos)
    layer.batchDraw()
  }, 5)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, _layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
    this.sendToWebSocket(canvasElement, socket)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.rulerCreator = new RulerCreator(canvasElement.tool.size || this.size, canvasElement.tool.colour || this.colour)
    this.rulerCreator.create(canvasElement, layer)
    this.rulerCreator.move(canvasElement, layer, { x: canvasElement.data[2], y: canvasElement.data[3] })
    layer.batchDraw()
  }

  sendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'ruler',
        colour: this.colour,
        size: this.size
      },
      temporary: this.temporary,
      data: canvasElement.data
    }
    socket.send(JSON.stringify(data))
  }
}
