import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'

export default class Line implements Tool {
  private line: Konva.Line
  private arrow: Konva.Arrow
  private TBar: Konva.Line
  private stroke: number[][]
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public endStyle: string,
               public strokeStyle: number,
               public temporarily: boolean) {
    this.line = new Konva.Line()
    this.arrow = new Konva.Arrow()
    this.TBar = new Konva.Line()
    this.stroke = [
      [0, 0],
      [30, 10]
    ]
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    canvasElement.endStyle = this.endStyle
    canvasElement.strokeStyle = this.strokeStyle
    this.line = new Konva.Line()
    this.arrow = new Konva.Arrow()
    this.TBar = new Konva.Line()
    if (this.endStyle === 'line') {
      this.line = this.createLineElement(canvasElement)
      layer.add(this.line)
    } else if (this.endStyle === 'arrow') {
      this.arrow = this.createArrowElement(canvasElement)
      layer.add(this.arrow)
    } else if (this.endStyle === 'T') {
      this.line = this.createLineElement(canvasElement)
      this.TBar = this.createTElement(canvasElement)
      layer.add(this.TBar)
      layer.add(this.line)
    }
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    this.TBar.points([canvasElement.data[0], canvasElement.data[1], e.evt.x, e.evt.y])
    if (this.endStyle === 'line') {
      this.line.points([canvasElement.data[0], canvasElement.data[1], e.evt.x, e.evt.y])
    } else if (this.endStyle === 'arrow') {
      this.arrow.points([canvasElement.data[0], canvasElement.data[1], e.evt.x, e.evt.y])
    } else if (this.endStyle === 'T') {
      this.TBar.points(this.calcTBar(canvasElement.data[0], canvasElement.data[1], e.evt.x, e.evt.y))
      this.line.points([canvasElement.data[0], canvasElement.data[1], e.evt.x, e.evt.y])
    }
    layer.batchDraw()
  }, 5)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, _layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
    this.sendToWebsockets(socket, canvasElement)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.strokeStyle = canvasElement.strokeStyle || 0
    if (canvasElement.endStyle === 'line') {
      layer.add(this.createLineElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size))
    } else if (canvasElement.endStyle === 'arrow') {
      layer.add(this.createArrowElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size))
    } else if (canvasElement.endStyle === 'T') {
      layer.add(this.createLineElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size))
      layer.add(this.createTElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size).points(
        this.calcTBar(canvasElement.data[0], canvasElement.data[1], canvasElement.data[2], canvasElement.data[3]))
      )
    } else {
      layer.add(this.createLineElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size))
    }
    layer.add(this.createLineElement(canvasElement, canvasElement.tool.colour, canvasElement.tool.size))
    layer.batchDraw()
  }

  createLineElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: colour || this.colour,
      strokeWidth: size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id,
      dash: this.stroke[this.strokeStyle]
    })
  }

  createTElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: colour || this.colour,
      strokeWidth: size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id
    })
  }

  createArrowElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Arrow => {
    return new Konva.Arrow({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: colour || this.colour,
      strokeWidth: size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id,
      dash: this.stroke[this.strokeStyle],
      fill: this.colour
    })
  }
  // I dont know how to explain how this works, but it works so fuck it
  calcTBar = (x1: number, y1: number, x2: number, y2: number): number[] => {
    // Length of the T-Bar head
    const distance = 15
    const f = (-1 * (x2 - x1))
    const d = (-1 * (y2 - y1))
    let AB = []
    if (Math.abs(f) < Math.abs(d)) { AB = [f / d, 1] } else { AB = [1, d / f] }
    const ABInv = [AB[1] * -1, AB[0]]
    const length = Math.sqrt(Math.pow(ABInv[0] * distance, 2) + Math.pow(ABInv[1] * distance, 2))
    const offset = distance - ((length - distance) / Math.sqrt(2))
    const xx1 = x2 + ABInv[0] * offset
    const yy1 = y2 + ABInv[1] * offset
    const xx2 = x2 + ABInv[0] * -offset
    const yy2 = y2 + ABInv[1] * -offset
    return [xx1, yy1, xx2, yy2]
  }

  sendToWebsockets = (socket: WebSocket, canvasElement: CanvasElement) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'line',
        colour: this.colour,
        size: this.size
      },
      temporary: this.temporarily,
      data: canvasElement.data,
      strokeStyle: canvasElement.strokeStyle,
      endStyle: canvasElement.endStyle
    }
    socket.send(JSON.stringify(data))
  }
}
