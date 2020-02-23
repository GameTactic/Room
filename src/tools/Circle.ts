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
    this.mapRatio = 1 // TODO: Inplement map ratio dynamicly
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
    const x = e.evt.x
    const y = e.evt.y
    canvasElement.data = canvasElement.data.concat([x, y])
    this.circle.radius(this.calcRadius(x, y))
    const newPoints: number[] = this.line.points().concat([x, y])
    this.line.points(newPoints)
    this.text.setPosition(this.calcTextPosition(x, y))
    this.text.setText(Math.floor(this.calcRadius(x, y) * this.mapRatio) + ' m')
    layer.batchDraw()
  }, 10)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.sendToWebsockets(socket, canvasElement)
  }

  createTextElement = (canvasElement: CanvasElement, colour?: string): Konva.Shape & Konva.Text => {
    return new Konva.Text({
      x: canvasElement.data[0],
      y: canvasElement.data[1],
      text: '0 m',
      fontSize: 20,
      fontFamily: 'Calibri',
      fill: colour || this.colour
    })
  }

  createLineElement = (canvasElement: CanvasElement, colour?: string): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: [canvasElement.data[0], canvasElement.data[1]],
      stroke: colour || this.colour,
      strokeWidth: 2,
      lineCap: 'mitter',
      dash: [23, 10]
    })
  }

  createElement = (canvasElement: CanvasElement, colour?: string, stroke?: number): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      id: canvasElement.id,
      globalCompositeOperation: 'source-over',
      stroke: colour || this.colour,
      strokeWidth: stroke || this.size,
      radius: 5,
      x: canvasElement.data[0],
      y: canvasElement.data[1]
    })
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    layer.add(this.createElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size))
    layer.batchDraw()
  }

  calcTextPosition = (x: number, y: number): object => {
    const offsetX = (x - this.circle.getPosition().x) / 2
    const offsetY = (y - this.circle.getPosition().y) / 2
    return {
      x: this.circle.getPosition().x + offsetX,
      y: this.circle.getPosition().y + offsetY
    }
  }

  calcRadius = (x: number, y: number): number => {
    const a = Math.pow((x - this.circle.getPosition().x), 2)
    const b = Math.pow((y - this.circle.getPosition().y), 2)
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
