import { LineInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import LineCreator from '@/tools/shapes/LineCreator'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

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
  mouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
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
    this.lineCreator['create' + this.endStyle.toUpperCase()](canvasElement, layer, event)
    canvasElement.position = this.lineCreator.getGroup().position()
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (!canvasElement.hasMoved) {
      canvasElement.hasMoved = true
    }
    const pos = { x: event.globalOffset.x, y: event.globalOffset.y }
    this.lineCreator['move' + this.endStyle.toUpperCase()](canvasElement, layer, pos, event)
    layer.batchDraw()
  }, 5)

  mouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (!canvasElement.hasMoved) {
      this.lineCreator.destroy(canvasElement, layer)
    } else {
      if (canvasElement.tool.temporary) {
        this.lineCreator.runTemporaryAnimation(this.lineCreator.getGroup(), layer)
      }
      canvasElement.data = canvasElement.data.concat([event.globalOffset.x, event.globalOffset.y])
      this.sendToWebSocket(canvasElement, socket)
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    if (canvasElement.hasMoved) {
      this.lineCreator = new LineCreator(
        canvasElement.tool.temporary || this.temporary,
        canvasElement.tool.size || this.size,
        canvasElement.tool.colour || this.colour,
        canvasElement.tool.strokeStyle || this.strokeStyle
      )
      this.lineCreator['create' + canvasElement.tool.endStyle?.toUpperCase()](canvasElement, layer, event)
      layer.batchDraw()
      if (canvasElement.tool.temporary) {
        this.lineCreator.runTemporaryAnimation(this.lineCreator.getGroup(), layer)
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
