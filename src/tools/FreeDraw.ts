import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'

export default class FreeDraw implements Tool {
  private line: Konva.Line;
  constructor (public readonly name: string,
               public size: number,
               public colour: string) {
    this.line = new Konva.Line()
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    this.line = this.createElement(canvasElement)
    layer.add(this.line)
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    const x = e.evt.x
    const y = e.evt.y
    canvasElement.data = canvasElement.data.concat([x, y])
    const newPoints: number[] = this.line.points().concat([x, y])
    this.line.points(newPoints)
    layer.batchDraw()
  }, 0)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, _layer: Konva.Layer, socket: WebSocket): void => {
    this.sendToWebsockets(socket, canvasElement)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    layer.add(this.createElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size))
    layer.batchDraw()
  }

  createElement = (canvasElement: CanvasElement, colour?: string, stroke?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      lineJoin: 'bevel',
      points: canvasElement.data,
      stroke: colour || this.colour,
      strokeWidth: stroke || this.size,
      bezier: true,
      lineCap: 'round',
      id: canvasElement.id
    })
  }

  sendToWebsockets = (socket: WebSocket, canvasElement: CanvasElement) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'freedraw',
        colour: this.colour,
        size: this.size
      },
      temporary: false,
      data: canvasElement.data
    }
    socket.send(JSON.stringify(data))
  }
}
