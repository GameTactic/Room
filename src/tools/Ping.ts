import { PingInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import throttle from 'lodash.throttle'
import uuid from 'uuid'
import PingCreator from '@/tools/shapes/PingCreator'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class Ping implements PingInterface {
  private pingCreator: PingCreator
  constructor (public readonly name: string,
               public readonly size: number,
               public readonly colour: string,
               public readonly temporary: boolean) {
    this.pingCreator = new PingCreator(
      this.temporary,
      this.size,
      this.colour
    )
  }

  mouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.triggerPing(event, canvasElement, layer, socket)
  }

  mouseMoveAction = throttle((event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.triggerPing(event, canvasElement, layer, socket)
  }, 75)

  mouseUpAction = (): void => {
    // mouse up action
  }

  triggerPing = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
    canvasElement.id = uuid()
    canvasElement.hasMoved = true
    canvasElement.tracker = Tracker.ADDITION
    canvasElement.tool = {
      name: this.name,
      colour: this.colour,
      size: this.size,
      temporary: this.temporary
    }
    this.pingCreator.create(canvasElement, layer, event)
    canvasElement.position = this.pingCreator.getGroup().position()
    this.sendToWebSocket(canvasElement, socket)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    this.pingCreator = new PingCreator(
      canvasElement.tool.temporary || this.temporary,
      canvasElement.tool.size || this.size,
      canvasElement.tool.colour || this.colour
    )
    this.pingCreator.create(canvasElement, layer, event)
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
      hasMoved: true,
      position: canvasElement.position
    }
    socket.send(JSON.stringify(data))
  }
}
