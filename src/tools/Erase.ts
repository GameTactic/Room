import { Tool } from '@/tools/Tool'
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
    canvasElement.tool = {
      name: this.name,
      erase: undefined,
      temporary: false
    }
  }
  // eslint-disable-next-line
  mouseMoveAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {

  }

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    const groupId = this.eraseGroup(layer, (e.target.parent?.attrs.id))
    if (groupId) {
      canvasElement.tool.erase = groupId
      this.sendToWebSocket(canvasElement, socket)
    }
  }

  eraseGroup = (layer: Konva.Layer, groupId?: string): string | void => {
    if (groupId) {
      const group: Konva.Collection<Konva.Node> = layer.getChildren(node => node.attrs.id === groupId)
      group.each(child => child.destroy())
      layer.batchDraw()
      return groupId
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.eraseGroup(layer, canvasElement.tool.erase)
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
      data: canvasElement.data
    }
    socket.send(JSON.stringify(data))
  }
}
