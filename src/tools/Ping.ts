import { Tool } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
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

  mouseDownAction = (canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    const dataCoords: number[] = []
    this.runAnimation(dataCoords, layer)
    this.sendToWebsockets(socket, dataCoords, canvasElement.layerId)
  }

  mouseMoveAction = throttle((e: Konva.KonvaPointerEvent, canvasElement: CanvasElement, layer: Konva.Layer, socket: WebSocket): void => {
    const dataCoords: number[] = [e.evt.x, e.evt.y]
    this.runAnimation(dataCoords, layer)
    this.sendToWebsockets(socket, dataCoords, canvasElement.layerId)
  }, 75)

  mouseUpAction = (): void => {
    // mouse up action
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.runAnimation(canvasElement.data, layer, canvasElement.tool.colour, canvasElement.tool.size)
  }

  createElement = (dataCoords: number[], colour?: string, stroke?: number): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      x: dataCoords[0],
      y: dataCoords[1],
      radius: 0,
      stroke: colour || this.colour,
      strokeWidth: stroke || this.size
    })
  }

  sendToWebsockets = (socket: WebSocket, dataCoords: number[], layerId: string) => {
    const data: CanvasElement = {
      jti: 'SAM',
      id: uuid(),
      layerId,
      tool: {
        name: 'ping',
        colour: this.colour,
        size: this.size
      },
      temporary: true,
      data: dataCoords
    }
    socket.send(JSON.stringify(data))
  }

  runAnimation = (dataCoords: number[], layer: Konva.Layer, colour?: string, size?: number): void => {
    const item = this.createElement(dataCoords, colour, size)
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
