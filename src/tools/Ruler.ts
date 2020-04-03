import { RulerInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import RulerCreator from '@/tools/shapes/RulerCreator'

export default class Ruler implements RulerInterface {
  private rulerCreator: RulerCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean,
               public showCircle: boolean) {
    this.rulerCreator = new RulerCreator(
      this.temporary,
      this.size,
      this.colour,
      this.showCircle
    )
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    canvasElement.hasMoved = false
    canvasElement.tracker = Tracker.ADDITION
    canvasElement.tool = {
      name: this.name,
      size: this.size,
      colour: this.colour,
      temporary: this.temporary,
      showCircle: this.showCircle
    }
    this.rulerCreator = new RulerCreator(
      this.temporary,
      this.size,
      this.colour,
      this.showCircle
    )
    this.rulerCreator.create(canvasElement, layer)
    canvasElement.position = this.rulerCreator.getGroup().position()
  }

  // eslint-disable-next-line
  mouseMoveAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (!canvasElement.hasMoved) {
      canvasElement.hasMoved = true
    }
    const pos = { x: e.evt.x, y: e.evt.y }
    this.rulerCreator.move(canvasElement, layer, pos)
    layer.batchDraw()
  }

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (!canvasElement.hasMoved) {
      this.rulerCreator.destroy(canvasElement, layer)
    } else {
      if (canvasElement.tool.temporary) {
        this.rulerCreator.runTemporaryAnimation(this.rulerCreator.getGroup(), layer)
      }
      canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
      this.sendToWebSocket(canvasElement, socket)
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (canvasElement.hasMoved) {
      this.rulerCreator = new RulerCreator(
        canvasElement.tool.temporary || this.temporary,
        canvasElement.tool.size || this.size,
        canvasElement.tool.colour || this.colour,
        canvasElement.tool.showCircle || this.showCircle
      )
      this.rulerCreator.create(canvasElement, layer)
      this.rulerCreator.move(canvasElement, layer, { x: canvasElement.data[2], y: canvasElement.data[3] })
      layer.batchDraw()
      if (canvasElement.tool.temporary) {
        this.rulerCreator.runTemporaryAnimation(this.rulerCreator.getGroup(), layer)
      }
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
        temporary: this.temporary,
        showCircle: this.showCircle
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
