import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import Shape, { FreeDrawCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class FreedrawCreator extends Shape implements FreeDrawCreatorInterface {
  private freedraw: Konva.Line
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size: number,
               public colour: string) {
    super()
    this.freedraw = new Konva.Line()
  }

  create = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    this.group.attrs.temporary = this.temporary
    this.group.id(canvasElement.id).add(
      this.freedraw = this.createFreedrawElement(canvasElement, event)
    )
    layer.add(this.group)
  }

  // eslint-disable-next-line
  move = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent): void => {
    const newPoints = canvasElement.data.map((num) => (num % 2) ? this.formatX(num, event) : this.formatY(num, event))
    this.freedraw.points(newPoints)
  }

  createFreedrawElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    const newPoints = canvasElement.data.map((num) => (num % 2) ? this.formatX(num, event) : this.formatY(num, event))
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      lineJoin: 'bevel',
      points: newPoints,
      stroke: colour || canvasElement.tool.colour || this.colour,
      strokeWidth: size || canvasElement.tool.size || this.size,
      bezier: true,
      lineCap: 'round',
      hitStrokeWidth: this.hitStroke,
      id: canvasElement.id
    })
  }
}
