import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'

export default class Circle implements Tool {
  private circle: Konva.Circle;
  private line: Konva.Line;
  private mapRatio: number;
  private stroke: number[][];
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporarily: boolean,
               public showRadius: boolean,
               public outlineColour: string,
               public strokeStyle: number
  ) {
    this.circle = new Konva.Circle()
    this.line = new Konva.Line()
    this.mapRatio = 1
    this.stroke = [
      [0, 0],
      [15 * this.mapRatio, 5 * this.mapRatio],
      [15 * this.mapRatio, 5 * this.mapRatio]
    ]
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    console.log(this)
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    this.circle = this.createElement(canvasElement)
    layer.add(this.circle)
    if (this.showRadius) {
      this.line = this.createLineElement(canvasElement)
      layer.add(this.line)
    }
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    this.circle.radius(this.calcRadius(e.evt.x, e.evt.y, this.circle.getPosition().x, this.circle.getPosition().y))
    if (this.showRadius) {
      this.line.points([canvasElement.data[0], canvasElement.data[1], e.evt.x, e.evt.y])
    }
    layer.batchDraw()
  }, 10)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
    this.sendToWebsockets(socket, canvasElement)
  }

  createLineElement = (canvasElement: CanvasElement, outlineColour?: string): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: outlineColour || this.outlineColour,
      strokeWidth: 2,
      lineCap: 'mitter',
      dash: this.stroke[this.strokeStyle]
    })
  }

  createElement = (canvasElement: CanvasElement, colour?: string, stroke?: number, radius?: number, outlineColour?: string): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      id: canvasElement.id,
      globalCompositeOperation: 'source-over',
      fill: colour || this.colour,
      stroke: outlineColour || this.outlineColour,
      strokeWidth: stroke || this.size,
      radius: radius || 0,
      x: canvasElement.data[0],
      y: canvasElement.data[1],
      dash: this.stroke[this.strokeStyle]
    })
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    const radius = this.calcRadius(canvasElement.data[0], canvasElement.data[1], canvasElement.data[2], canvasElement.data[3])
    layer.add(this.createElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size, radius, canvasElement.outlineColour))
    if (canvasElement.showRadius) {
      layer.add(this.createLineElement(canvasElement, canvasElement.outlineColour))
    }
    layer.batchDraw()
  }

  calcRadius = (x1: number, y1: number, x2: number, y2: number): number => {
    const a = Math.pow((x1 - x2), 2)
    const b = Math.pow((y1 - y2), 2)
    return Math.sqrt(a + b)
  }

  sendToWebsockets = (socket: WebSocket, canvasElement: CanvasElement) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'circle',
        colour: this.colour,
        size: this.size
      },
      temporary: this.temporarily,
      showRadius: this.showRadius,
      strokeStyle: this.strokeStyle,
      outlineColour: this.outlineColour,
      data: canvasElement.data
    }
    socket.send(JSON.stringify(data))
  }
}
