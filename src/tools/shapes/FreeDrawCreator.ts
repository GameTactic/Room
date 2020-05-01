import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import Shape, { FreeDrawCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class FreeDrawCreator extends Shape implements FreeDrawCreatorInterface {
  private freeDraw: Konva.Line
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size: number,
               public colour: string) {
    super()
    this.freeDraw = new Konva.Line()
  }

  create = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    this.group.attrs.temporary = this.temporary
    this.group.id(canvasElement.id).add(
      this.freeDraw = this.createFreeDrawElement(canvasElement, event)
    )
    layer.add(this.group)
  }

  move = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent): void => {
    this.freeDraw.points(canvasElement.data.map((num, index) => (index % 2) ? this.formatX(num, event) : this.formatY(num, event)))
  }

  createFreeDrawElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data.map((num, index) => (index % 2) ? this.formatX(num, event) : this.formatY(num, event)),
      stroke: colour || canvasElement.tool.colour || this.colour,
      strokeWidth: size || canvasElement.tool.size || this.size,
      hitStrokeWidth: this.hitStroke,
      id: canvasElement.id,
      lineJoin: 'round'
    })
  }
}
