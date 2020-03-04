import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { Shape } from '@/tools/shapes/Shape'

export default class FreedrawCreator implements Shape {
  private freedraw: Konva.Line
  constructor (public size?: number,
               public colour?: string) {
    this.freedraw = new Konva.Line()
  }

  create = (canvasElement: CanvasElement, layer: Konva.Layer): Konva.Line => {
    this.freedraw = this.createFreedrawElement(canvasElement)
    layer.add(this.freedraw)
    return this.freedraw
  }

  // eslint-disable-next-line
  move = (canvasElement: CanvasElement, layer: Konva.Layer, freedraw: Konva.Line): void => {
    freedraw.points(canvasElement.data)
  }

  createFreedrawElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      lineJoin: 'bevel',
      points: canvasElement.data,
      stroke: colour || this.colour,
      strokeWidth: size || this.size,
      bezier: true,
      lineCap: 'round',
      id: canvasElement.id
    })
  }
}
