import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'
import RulerCreator from '@/tools/shapes/RulerCreator'

export default class Ruler implements Tool {
  private line: Konva.Line
  private text: Konva.Text
  private circle: Konva.Circle
  private rulerCreator: RulerCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean) {
    this.line = new Konva.Line()
    this.text = new Konva.Text()
    this.circle = new Konva.Circle()
    this.rulerCreator = new RulerCreator(this.size, this.colour)
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    const result = this.rulerCreator.create(canvasElement, layer)
    this.circle = result.circle
    this.line = result.line
    this.text = result.text
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    const pos = {
      x: e.evt.x,
      y: e.evt.y
    }
    this.rulerCreator.move(canvasElement, layer, pos, this.line, this.text, this.circle)
    layer.batchDraw()
  }, 5)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, _layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
    socket.send(JSON.stringify(canvasElement))
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.rulerCreator = new RulerCreator(
      canvasElement.tool.size || this.size,
      canvasElement.tool.colour || this.colour
    )
    const result = this.rulerCreator.create(canvasElement, layer)
    const pos = {
      x: canvasElement.data[2],
      y: canvasElement.data[3]
    }
    this.rulerCreator.move(canvasElement, layer, pos, result.line, result.text, result.circle)
    layer.batchDraw()
  }

  sendToWebsockets = (socket: WebSocket, canvasElement: CanvasElement) => {
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
