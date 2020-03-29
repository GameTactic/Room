import { Tool, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import throttle from 'lodash.throttle'

export default class FreeDraw implements Tool {
  // eslint-disable-next-line
  private group: Konva.Group
  constructor (public readonly name: string,
               public temporary: boolean) {
    this.group = new Konva.Group()
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.hasMoved = false
    canvasElement.tracker = Tracker.MOVE
    canvasElement.tool = {
      name: this.name,
      temporary: this.temporary
    }
    const group = e.target.parent
    if (group instanceof Konva.Group) {
      this.group = group
      canvasElement.id = this.group.attrs.id
    }
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (!canvasElement.hasMoved) {
      canvasElement.hasMoved = true
    }
    const pos = { x: (e.evt.x - canvasElement.data[0]), y: (e.evt.y - canvasElement.data[1]) }
    this.group.move(pos)
    layer.batchDraw()
    canvasElement.data = [e.evt.x, e.evt.y]
  }, 0)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, _layer: Konva.Layer, socket: WebSocket): void => {
    if (canvasElement.hasMoved) {
      canvasElement.position = { x: this.group.position().x, y: this.group.position().y }
      this.sendToWebSocket(canvasElement, socket)
    }
  }

  // eslint-disable-next-line
  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    const group = layer.findOne((group: Konva.Group) => group.attrs.id === canvasElement.id)
    console.log(canvasElement.id)
    if (group) {
      group.move({ x: canvasElement.data[0], y: canvasElement.data[1] })
    }
    layer.batchDraw()
  }

  sendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'move',
        temporary: this.temporary
      },
      data: canvasElement.data,
      tracker: Tracker.MOVE,
      change: true,
      hasMoved: canvasElement.hasMoved,
      position: canvasElement.position
    }
    socket.send(JSON.stringify(data))
  }
}
