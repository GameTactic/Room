import { Tool, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'

export default class Erase implements Tool {
  // eslint-disable-next-line no-useless-constructor
  constructor (public readonly name: string,
               public readonly temporary: boolean) {
  }
  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    canvasElement.hasMoved = true
    canvasElement.tool = {
      name: this.name,
      erase: [],
      temporary: false
    }
    if (e.target.parent?.attrs.id && canvasElement.tool.erase) {
      if (!canvasElement.tool.erase.includes(e.target.parent?.attrs.id)) {
        canvasElement.tool.erase.push(e.target.parent?.attrs.id)
      }
    }
    this.hideGroup(layer, canvasElement.tool.erase)
  }
  // eslint-disable-next-line
  mouseMoveAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    if (e.target.parent?.attrs.id && canvasElement.tool.erase) {
      if (!canvasElement.tool.erase.includes(e.target.parent?.attrs.id)) {
        canvasElement.tool.erase.push(e.target.parent?.attrs.id)
      }
    }
    this.hideGroup(layer, canvasElement.tool.erase)
  }

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    const groupId = this.eraseGroup(layer, canvasElement.tool.erase)
    if (groupId) {
      canvasElement.tool.erase = groupId
      this.sendToWebSocket(canvasElement, socket)
    }
  }

  hideGroup = (layer: Konva.Layer, group?: string[]) => {
    if (group) {
      group.forEach((groupId: string) => {
        const group: Konva.Collection<Konva.Node> = layer.getChildren(node => node.attrs.id === groupId)
        group.each(child => child.hide())
        layer.batchDraw()
      })
      return group
    }
  }

  eraseGroup = (layer: Konva.Layer, group?: string[]): string[] | void => {
    if (group) {
      group.forEach((groupId: string) => {
        const group: Konva.Collection<Konva.Node> = layer.getChildren(node => node.attrs.id === groupId)
        group.each(child => child.destroy())
        layer.batchDraw()
      })
      return group
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (canvasElement.tracker === Tracker.REMOVAL) {
      this.eraseGroup(layer, canvasElement.tool.erase)
    }
  }

  sendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'erase',
        erase: canvasElement.tool.erase,
        temporary: this.temporary
      },
      data: canvasElement.data,
      tracker: Tracker.ADDITION,
      change: false,
      hasMoved: true
    }
    socket.send(JSON.stringify(data))
  }
}
