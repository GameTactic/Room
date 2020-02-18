import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElementPayload, CanvasElement, Data } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'

export default class FreeDraw implements Tool {
  private line: Konva.Line;
  constructor (public readonly name: string,
               public size: number,
               public colour: string) {
    this.line = new Konva.Line({ points: [0, 0] })
  }

  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElementPayload: CanvasElementPayload, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElementPayload.data = []
    canvasElementPayload.data.push({ x: e.evt.x, y: e.evt.y })
    this.line = this.createElement(canvasElementPayload)
    layer.add(this.line)
  }

  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElementPayload: CanvasElementPayload, layer: Konva.Layer, _socket: WebSocket): void => {
    const data = { x: e.evt.x, y: e.evt.y }
    canvasElementPayload.data.push(data)
    const newPoints: number[] = this.line.points().concat([data.x, data.y])
    this.line.points(newPoints)
    layer.add(this.line)
    layer.batchDraw()
  }, 10)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElementPayload: CanvasElementPayload, layer: Konva.Layer, socket: WebSocket): void => {
    this.sendToWebsockets(socket, canvasElementPayload)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.line = this.createElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size)
    canvasElement.data.forEach((data: Data) => {
      const newPoints: number[] = this.line.points().concat([data.x, data.y])
      this.line.points(newPoints)
      layer.add(this.line)
      layer.batchDraw()
    })
  }

  createElement = (canvasElementPayload: CanvasElementPayload, colour?: string, stroke?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      lineJoin: 'bevel',
      points: [canvasElementPayload.data[0].x, canvasElementPayload.data[0].y],
      stroke: colour || this.colour,
      strokeWidth: stroke || this.size,
      bezier: true,
      lineCap: 'round'
    })
  }

  sendToWebsockets = (socket: WebSocket, canvasElementPayload: CanvasElementPayload) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: uuid(),
      tool: {
        name: 'freedraw',
        colour: this.colour,
        size: this.size
      },
      immediate: false,
      data: canvasElementPayload.data
    }
    socket.send(JSON.stringify(data))
  }
}
