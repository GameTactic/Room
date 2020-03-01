import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'

export default class Circle implements Tool {
  private circle: Konva.Circle;
  private line: Konva.Line;
  private text: Konva.Text;
  private mapRatio: number;
  constructor (public readonly name: string,
               public size: number,
               public colour: string) {
    this.circle = new Konva.Circle()
    this.line = new Konva.Line()
    this.text = new Konva.Text()
    this.mapRatio = 1 // TODO: Implement map ratio dynamically
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    this.circle = this.createElement(canvasElement)
    this.line = this.createLineElement(canvasElement)
    this.text = this.createTextElement(canvasElement)
    layer.add(this.text)
    layer.add(this.circle)
    layer.add(this.line)
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    this.circle.radius(this.calcRadius(e.evt.x, e.evt.y, this.circle.getPosition().x, this.circle.getPosition().y))
    this.line.points([canvasElement.data[0], canvasElement.data[1], e.evt.x, e.evt.y])
    this.text.setPosition(this.calcTextPosition(e.evt.x, e.evt.y, this.circle.getPosition().x, this.circle.getPosition().y))
    this.text.setText(Math.floor(this.calcRadius(e.evt.x, e.evt.y, this.circle.getPosition().x, this.circle.getPosition().y) * this.mapRatio) + ' m')
    layer.batchDraw()
  }, 10)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
    this.sendToWebsockets(socket, canvasElement)
  }

  createTextElement = (canvasElement: CanvasElement, colour?: string, text?: string): Konva.Shape & Konva.Text => {
    return new Konva.Text({
      x: canvasElement.data[0],
      y: canvasElement.data[1],
      text: text || '0 m',
      fontSize: 20,
      fontFamily: 'Calibri',
      fill: colour || this.colour
    })
  }

  createLineElement = (canvasElement: CanvasElement, colour?: string): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: colour || this.colour,
      strokeWidth: 2,
      lineCap: 'mitter',
      dash: [23, 10]
    })
  }

  createElement = (canvasElement: CanvasElement, colour?: string, stroke?: number, radius?: number): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      id: canvasElement.id,
      globalCompositeOperation: 'source-over',
      stroke: colour || this.colour,
      strokeWidth: stroke || this.size,
      radius: radius || 0,
      x: canvasElement.data[0],
      y: canvasElement.data[1]
    })
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    // Render circle
    const radius = this.calcRadius(canvasElement.data[0], canvasElement.data[1], canvasElement.data[2], canvasElement.data[3])
    layer.add(this.createElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size, radius))
    // Render dashed line
    layer.add(this.createLineElement(canvasElement, canvasElement.tool.colour))
    // Render text
    this.text = this.createTextElement(canvasElement, canvasElement.tool.colour, Math.floor(radius * this.mapRatio) + ' m')
    this.text.setPosition(this.calcTextPosition(canvasElement.data[2], canvasElement.data[3], canvasElement.data[0], canvasElement.data[1]))
    layer.add(this.text)
    // Batch draw
    layer.batchDraw()
  }

  calcTextPosition = (x1: number, y1: number, x2: number, y2: number): object => {
    const offset = 30
    const offsetX = (x1 - x2) / 2
    const offsetY = (y1 - y2) / 2
    const angleX = -(y1 - y2) / (this.calcRadius(x1, y1, x2, y2))
    const angleY = (x1 - x2) / (this.calcRadius(x1, y1, x2, y2))
    return {
      x: x2 + offsetX + (angleX * offset) - (this.text.getWidth() / 2),
      y: y2 + offsetY + (angleY * offset) - (this.text.getHeight() / 2)
    }
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
      temporary: false,
      data: canvasElement.data
    }
    socket.send(JSON.stringify(data))
  }
}
