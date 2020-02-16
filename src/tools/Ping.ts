import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElementPayload, Data, CanvasElement } from '@/types/Canvas'
import throttle from 'lodash.throttle'
import uuid from 'uuid'

export default class Ping implements Tool {
  private readonly amplitude = 25
  private readonly period = 500
  // eslint-disable-next-line no-useless-constructor
  constructor (public readonly name: string,
               public readonly size: number,
               public readonly colour: string) {
  }

  mouseDownAction = (e: Konva.KonvaPointerEvent, _canvasElementPayload: CanvasElementPayload, layer: Konva.Layer, socket: WebSocket): void => {
    const dataCoords: Data = { x: e.evt.x, y: e.evt.y }
    this.runAnimation(dataCoords, layer)
    this.sendToWebsockets(socket, dataCoords)
  }

  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, _canvasElementPayload: CanvasElementPayload, layer: Konva.Layer, socket: WebSocket): void => {
    const dataCoords: Data = { x: e.evt.x, y: e.evt.y }
    this.runAnimation(dataCoords, layer)
    this.sendToWebsockets(socket, dataCoords)
  }, 75)

  mouseUpAction = (): Data[] => {
    return []
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.runAnimation(canvasElement.data[0], layer, canvasElement.tool.colour, canvasElement.tool.size)
  }

  createElement = (dataCoords: Data, colour?: string, stroke?: number): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      x: dataCoords.x,
      y: dataCoords.y,
      radius: 0,
      stroke: colour || this.colour,
      strokeWidth: stroke || this.size
    })
  }

  sendToWebsockets = (socket: WebSocket, dataCoords: Data) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: uuid(),
      tool: {
        name: 'ping',
        colour: this.colour,
        size: this.size
      },
      immediate: true,
      data: [{ x: dataCoords.x, y: dataCoords.y }]
    }
    socket.send(JSON.stringify(data))
  }

  runAnimation = (dataCoords: Data, layer: Konva.Layer, colour?: string, size?: number): void => {
    const item = this.createElement({ x: dataCoords.x, y: dataCoords.y }, colour, size)
    layer.add(item)
    const anim = new Konva.Animation((frame) => {
      if (frame) {
        item.radius(this.amplitude * Math.sin((frame.time * Math.PI) / 1000))
        item.opacity(1.8 - (frame.time * Math.PI) / 1000)
      }
    }, layer)
    anim.start()
    setTimeout(() => {
      item.destroy()
      anim.stop()
      layer.batchDraw()
    }, this.period)
  }
}
