import { FreeDrawInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'
import FreedrawCreator from '@/tools/shapes/FreedrawCreator'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class FreeDraw implements FreeDrawInterface {
  private freedrawCreator: FreedrawCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean) {
    this.freedrawCreator = new FreedrawCreator(
      this.temporary,
      this.size,
      this.colour
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
      temporary: this.temporary
    }
    this.freedrawCreator = new FreedrawCreator(
      this.temporary,
      this.size,
      this.colour
    )
    this.freedrawCreator.create(canvasElement, layer, event)
    canvasElement.position = this.freedrawCreator.getGroup().position()
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (!canvasElement.hasMoved) {
      canvasElement.hasMoved = true
    }
    canvasElement.data = canvasElement.data.concat([event.globalOffset.x, event.globalOffset.y])
    this.freedrawCreator.move(canvasElement, layer, event)
    layer.batchDraw()
  }, 0)

  mouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (!canvasElement.hasMoved) {
      this.freedrawCreator.destroy(canvasElement, layer)
    } else {
      if (canvasElement.tool.temporary) {
        this.freedrawCreator.runTemporaryAnimation(this.freedrawCreator.getGroup(), layer)
      }
      this.sendToWebSocket(canvasElement, socket)
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    if (canvasElement.hasMoved) {
      this.freedrawCreator = new FreedrawCreator(
        canvasElement.tool.temporary || this.temporary,
        canvasElement.tool.size || this.size,
        canvasElement.tool.colour || this.colour
      )
      this.freedrawCreator.create(canvasElement, layer, event)
      layer.batchDraw()
      if (canvasElement.tool.temporary) {
        this.freedrawCreator.runTemporaryAnimation(this.freedrawCreator.getGroup(), layer)
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
