import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElementPayload, CanvasElement } from '@/types/Canvas'
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

  // eslint-disable-unused-parameters
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElementPayload: CanvasElementPayload, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElementPayload.data = []
    canvasElementPayload.data.push({ x: e.evt.x, y: e.evt.y })
    this.circle = this.createElement(canvasElementPayload)
    this.line = this.createLineElement(canvasElementPayload)
    this.text = this.createTextElement(canvasElementPayload)
    layer.add(this.text)
    layer.add(this.circle)
    layer.add(this.line)
  }

  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElementPayload: CanvasElementPayload, layer: Konva.Layer, _socket: WebSocket): void => {
    const data = {
      x: e.evt.x,
      y: e.evt.y
    }
    canvasElementPayload.data.push(data)
    this.circle.radius(this.calcRadius(e.evt.x, e.evt.y))
    this.line.points([canvasElementPayload.data[0].x, canvasElementPayload.data[0].y, e.evt.x, e.evt.y])
    this.text.setPosition(this.calcTextPosition(e.evt.x, e.evt.y))
    this.text.setText(Math.floor(this.calcRadius(e.evt.x, e.evt.y) * this.mapRatio) + ' m')
    layer.add(this.line)
    layer.add(this.circle)
    layer.batchDraw()
  }, 10)

  createTextElement = (canvasElementPayload: CanvasElementPayload, colour?: string): Konva.Shape & Konva.Text => {
    return new Konva.Text({
      x: canvasElementPayload.data[0].x,
      y: canvasElementPayload.data[0].y,
      text: '0 m',
      fontSize: 20,
      fontFamily: 'Calibri',
      fill: colour || this.colour
    })
  }

  createLineElement = (canvasElementPayload: CanvasElementPayload, colour?: string): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: [canvasElementPayload.data[0].x, canvasElementPayload.data[0].y],
      stroke: colour || this.colour,
      strokeWidth: 2,
      lineCap: 'mitter',
      dash: [23, 10]
    })
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

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElementPayload: CanvasElementPayload, layer: Konva.Layer, socket: WebSocket): void => {
    this.sendToWebsockets(socket, canvasElementPayload)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    console.log('layer', layer) // eslint-disable-line
    console.log('canvasElement', canvasElement) // eslint-disable-line
  }

  createElement = (canvasElementPayload: CanvasElementPayload, colour?: string, stroke?: number): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      globalCompositeOperation: 'source-over',
      stroke: colour || this.colour,
      strokeWidth: stroke || this.size,
      radius: 5,
      x: canvasElementPayload.data[0].x,
      y: canvasElementPayload.data[0].y
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
