import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import LineCreator from '@/tools/shapes/LineCreator'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'

export default class Line implements Tool {
  private line: Konva.Line
  private arrow: Konva.Arrow
  private tBar: Konva.Line
  private lineCreator: LineCreator
  private stroke: number[][]
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public endStyle: string,
               public strokeStyle: number,
               public temporary: boolean) {
    this.line = new Konva.Line()
    this.arrow = new Konva.Arrow()
    this.tBar = new Konva.Line()
    this.lineCreator = new LineCreator(this.size, this.colour, this.strokeStyle)
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
    const result = this.lineCreator['create' + this.endStyle.toUpperCase()](canvasElement, layer)
    this.line = result.line
    this.arrow = result.arrow
    this.tBar = result.tBar
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    const pos = {
      x: e.evt.x,
      y: e.evt.y
    }
    this.lineCreator['move' + this.endStyle.toUpperCase()](canvasElement, layer, pos, this.line, this.arrow, this.tBar)
    layer.batchDraw()
  }, 5)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, _layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
    this.sendToWebsockets(socket, canvasElement)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.lineCreator = new LineCreator(
      canvasElement.tool.size || this.size,
      canvasElement.tool.colour || this.colour,
      canvasElement.strokeStyle || this.strokeStyle
    )
    this.lineCreator['create' + canvasElement.endStyle.toUpperCase()](canvasElement, layer)
    layer.batchDraw()
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
      temporary: this.temporary,
      data: canvasElement.data,
      strokeStyle: canvasElement.strokeStyle,
      endStyle: canvasElement.endStyle
    }
    socket.send(JSON.stringify(data))
  }
}
