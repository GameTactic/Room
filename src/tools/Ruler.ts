import { RulerInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import RulerCreator from '@/tools/shapes/RulerCreator'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

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
  mouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
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
    this.rulerCreator.create(canvasElement, layer, event)
    canvasElement.position = this.rulerCreator.getGroup().position()
  }

  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (!canvasElement.hasMoved) {
      canvasElement.hasMoved = true
    }
    const pos = { x: event.globalOffset.x, y: event.globalOffset.y }
    this.rulerCreator.move(canvasElement, layer, pos, event)
    layer.batchDraw()
  }

  mouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (!canvasElement.hasMoved) {
      this.rulerCreator.destroy(canvasElement, layer)
    } else {
      if (canvasElement.tool.temporary) {
        this.rulerCreator.runTemporaryAnimation(this.rulerCreator.getGroup(), layer)
      }
      canvasElement.data = canvasElement.data.concat([event.globalOffset.x, event.globalOffset.y])
      this.sendToWebSocket(canvasElement, socket)
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    if (canvasElement.hasMoved) {
      this.rulerCreator = new RulerCreator(
        canvasElement.tool.temporary || this.temporary,
        canvasElement.tool.size || this.size,
        canvasElement.tool.colour || this.colour,
        canvasElement.tool.showCircle || this.showCircle
      )
      this.rulerCreator.create(canvasElement, layer, event)
      this.rulerCreator.move(canvasElement, layer, { x: canvasElement.data[2], y: canvasElement.data[3] }, event)
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
