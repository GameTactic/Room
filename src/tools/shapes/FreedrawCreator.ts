import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { Shape } from '@/tools/shapes/Shape'

export default class FreedrawCreator implements Shape {
  private freedraw: Konva.Line
  private group: Konva.Group
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size?: number,
               public colour?: string) {
    this.freedraw = new Konva.Line()
    this.group = new Konva.Group()
  }

  create = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.group.attrs.temporary = this.temporary
    this.group.id(canvasElement.id).add(
      this.freedraw = this.createFreedrawElement(canvasElement)
    )
    layer.add(this.group)
  }

  // eslint-disable-next-line
  move = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.freedraw.points(canvasElement.data)
  }

  createFreedrawElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      lineJoin: 'bevel',
      points: canvasElement.data,
      stroke: colour || canvasElement.tool.colour || this.colour,
      strokeWidth: size || canvasElement.tool.size || this.size,
      bezier: true,
      lineCap: 'round',
      hitStrokeWidth: this.hitStroke,
      id: canvasElement.id
    })
  }
}
