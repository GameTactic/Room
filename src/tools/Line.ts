import { LineInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import LineCreator from '@/tools/shapes/LineCreator'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'

export default class Line implements LineInterface {
  private lineCreator: LineCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public endStyle: string,
               public strokeStyle: number,
               public temporary: boolean) {
    this.lineCreator = new LineCreator(
      this.temporary,
      this.size,
      this.colour,
      this.strokeStyle
    )
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    canvasElement.tracker = Tracker.ADDITION
    canvasElement.hasMoved = false
    canvasElement.tool = {
      name: this.name,
      colour: this.colour,
      size: this.size,
      endStyle: this.endStyle,
      strokeStyle: this.strokeStyle,
      temporary: this.temporary
    }
    this.lineCreator = new LineCreator(
      this.temporary,
      this.size,
      this.colour,
      this.strokeStyle
    )
    this.lineCreator['create' + this.endStyle.toUpperCase()](canvasElement, layer)
    canvasElement.position = this.lineCreator.getGroup().position()
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (!canvasElement.hasMoved) {
      canvasElement.hasMoved = true
    }
    const pos = { x: e.evt.x, y: e.evt.y }
    this.lineCreator['move' + this.endStyle.toUpperCase()](canvasElement, layer, pos)
    layer.batchDraw()
  }, 5)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, _layer: Konva.Layer, socket: WebSocket): void => {
    if (canvasElement.tool.temporary || !canvasElement.hasMoved) {
      this.lineCreator.destroy(canvasElement, _layer)
    } else {
      canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
      this.sendToWebSocket(canvasElement, socket)
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (!canvasElement.tool.temporary && canvasElement.hasMoved) {
      this.lineCreator = new LineCreator(
        canvasElement.tool.temporary || this.temporary,
        canvasElement.tool.size || this.size,
        canvasElement.tool.colour || this.colour,
        canvasElement.tool.strokeStyle || this.strokeStyle
      )
      this.lineCreator['create' + canvasElement.tool.endStyle?.toUpperCase()](canvasElement, layer)
      layer.batchDraw()
    }
  }

  sendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: this.name,
        colour: this.colour,
        size: this.size,
        strokeStyle: this.strokeStyle,
        endStyle: this.endStyle,
        temporary: this.temporary
      },
      data: canvasElement.data,
      tracker: Tracker.ADDITION,
      change: false,
      hasMoved: canvasElement.hasMoved,
      position: canvasElement.position
    }
    socket.send(JSON.stringify(data))
  }
}
