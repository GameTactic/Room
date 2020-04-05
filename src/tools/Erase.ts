import { EraseInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import { CustomEvent } from '@/util/PointerEventMapper'

export default class Erase implements EraseInterface {
  // eslint-disable-next-line no-useless-constructor
  constructor (public readonly name: string,
               public erase: string[],
               public readonly temporary: boolean) {
  }
  // eslint-disable-next-line
  mouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
    canvasElement.id = uuid()
    canvasElement.hasMoved = true
    canvasElement.tracker = Tracker.REMOVAL
    canvasElement.tool = {
      name: this.name,
      erase: this.erase,
      temporary: false
    }
    this.findAndHide(event, canvasElement, layer)
  }
  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.findAndHide(event, canvasElement, layer)
  }

  mouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.findAndHide(event, canvasElement, layer)
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

  findAndHide = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (event.konvaPointerEvent.target.parent && event.konvaPointerEvent.target.parent instanceof Konva.Group) {
      if (event.konvaPointerEvent.target.parent.attrs.id && canvasElement.tool.erase) {
        if (!canvasElement.tool.erase.includes(event.konvaPointerEvent.target.parent.attrs.id)) {
          canvasElement.tool.erase.push(event.konvaPointerEvent.target.parent.attrs.id)
        }
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
