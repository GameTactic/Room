import { Tool, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import throttle from 'lodash.throttle'
import CircleCreator from '@/tools/shapes/CircleCreator'

export default class Circle implements Tool {
  private circleCreator: CircleCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean,
               public showRadius: boolean,
               public outlineColour: string,
               public strokeStyle: number
  ) {
    this.circleCreator = new CircleCreator(this.temporary)
  }

  // eslint-disable-next-line
  mouseDownAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    canvasElement.data = [e.evt.x, e.evt.y]
    canvasElement.id = uuid()
    canvasElement.tool = {
      name: this.name,
      size: this.size,
      colour: this.colour,
      showRadius: this.showRadius,
      outlineColour: this.outlineColour,
      strokeStyle: this.strokeStyle,
      temporary: this.temporary
    }
    this.circleCreator = new CircleCreator(this.temporary, this.size, this.colour, this.outlineColour, this.strokeStyle, this.showRadius)
    this.circleCreator.create(canvasElement, layer)
  }

  // eslint-disable-next-line
  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, _socket: WebSocket): void => {
    const pos = { x: e.evt.x, y: e.evt.y }
    this.circleCreator.move(canvasElement, layer, pos)
    layer.batchDraw()
  }, 10)

  mouseUpAction = (e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    canvasElement.data = canvasElement.data.concat([e.evt.x, e.evt.y])
    this.sendToWebSocket(canvasElement, socket)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.circleCreator = new CircleCreator(
      canvasElement.tool.temporary || this.temporary,
      canvasElement.tool.size || this.size,
      canvasElement.tool.colour || this.colour,
      canvasElement.tool.outlineColour || this.outlineColour,
      canvasElement.tool.strokeStyle || this.strokeStyle,
      canvasElement.tool.showRadius || this.showRadius
    )
    this.circleCreator.create(canvasElement, layer)
    const pos = { x: canvasElement.data[2], y: canvasElement.data[3] }
    this.circleCreator.move(canvasElement, layer, pos)
    layer.batchDraw()
  }

  sendToWebSocket = (canvasElement: CanvasElement, socket: WebSocket) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: canvasElement.id,
      layerId: canvasElement.layerId,
      tool: {
        name: 'circle',
        colour: this.colour,
        size: this.size,
        showRadius: this.showRadius,
        strokeStyle: this.strokeStyle,
        outlineColour: this.outlineColour,
        temporary: this.temporary
      },
      data: canvasElement.data,
      tracker: Tracker.ADDITION,
      change: false
    }
    socket.send(JSON.stringify(data))
  }
}
