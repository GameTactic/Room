import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'

export default class Erase implements Tool {
  // eslint-disable-next-line no-useless-constructor
  constructor (public readonly name: string,
               public readonly temporary: boolean) {
  }

  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.findAndEraseGroup(e, canvasElement, layer, socket)
  }

  mouseMoveAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.findAndEraseGroup(e, canvasElement, layer, socket)
  }
  // eslint-disable-next-line
  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {

  }

  findAndEraseGroup = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    const groupId = e.target.parent?.attrs.id
    this.eraseGroup(canvasElement, layer, groupId)
    this.sendToWebSocket(canvasElement, socket)
  }

  eraseGroup = (canvasElement: CanvasElement, layer: Konva.Layer, groupId?: string): void => {
    if (groupId !== undefined && groupId !== null) {
      const group = layer.getChildren(node => {
        return node.attrs.id === groupId
      })
      if (group !== undefined && group !== null) {
        canvasElement.tool.erase = groupId
        const children = group.toArray()[0].getChildren()
        children.each(child => {
          child.hide()
          layer.draw()
        })
      }
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.eraseGroup(canvasElement, layer, canvasElement.tool.erase)
  }

  sendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'erase',
        erase: canvasElement.tool.erase
      },
      temporary: this.temporary,
      data: canvasElement.data
    }
    socket.send(JSON.stringify(data))
  }
}
