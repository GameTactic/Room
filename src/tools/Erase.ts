import { EraseInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'

export default class Erase implements EraseInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (public readonly name: string,
               public erase: string[],
               public readonly temporary: boolean) {
  }
  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    canvasElement.hasMoved = true
    canvasElement.tracker = Tracker.REMOVAL
    canvasElement.tool = {
      name: this.name,
      erase: this.erase,
      temporary: false
    }
    this.findAndHide(e, canvasElement, layer)
  }
  // eslint-disable-next-line
  mouseMoveAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.findAndHide(e, canvasElement, layer)
  }

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.findAndHide(e, canvasElement, layer)
    this.sendToWebSocket(canvasElement, socket)
  }

  hideGroup = (layer: Konva.Layer, group?: string[]): void => {
    if (group) {
      group.forEach((groupId: string) => {
        const group: Konva.Collection<Konva.Node> = layer.getChildren(node => node.attrs.id === groupId)
        group.each(child => child.hide())
        layer.batchDraw()
      })
    }
  }

  findAndHide = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (e.target.parent?.attrs.id && canvasElement.tool.erase) {
      if (!canvasElement.tool.erase.includes(e.target.parent?.attrs.id)) {
        canvasElement.tool.erase.push(e.target.parent?.attrs.id)
      }
    }
    this.hideGroup(layer, canvasElement.tool.erase)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (canvasElement.tracker === Tracker.REMOVAL) {
      this.hideGroup(layer, canvasElement.tool.erase)
    }
  }

  sendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: this.name,
        erase: canvasElement.tool.erase,
        temporary: this.temporary
      },
      data: canvasElement.data,
      tracker: Tracker.REMOVAL,
      change: false,
      hasMoved: true,
      position: canvasElement.position
    }
    socket.send(JSON.stringify(data))
  }
}
