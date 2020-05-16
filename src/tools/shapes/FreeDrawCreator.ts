import Konva from 'konva'
import { CanvasElement, CanvasElementType } from '@/types/Canvas'
import Shape, { FreeDrawCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'
import { FreeDrawData } from '@/tools/Tool'

export default class FreeDrawCreator extends Shape implements FreeDrawCreatorInterface {
  private freeDraw: Konva.Line
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size: number,
               public colour: string) {
    super()
    this.freeDraw = new Konva.Line()
  }

  create = (event: CustomEvent | CustomStageEvent, canvasElement?: CanvasElement): void => {
    if (!canvasElement) { canvasElement = this.canvasElement }
    this.group.id(canvasElement.id).add(
      this.freeDraw = this.createFreeDrawElement(canvasElement, event)
    )
    this.group.attrs.type = CanvasElementType.SHAPE
    this.layer.add(this.group)
  }

  move = (event: CustomEvent): void => {
    const data = this.canvasElement.data as FreeDrawData
    this.freeDraw.points(data.points.map((num, index) => (index % 2) ? this.formatX(num, event) : this.formatY(num, event)))
  }

  createFreeDrawElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    const data = canvasElement.data as FreeDrawData
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: data.points.map((num, index) => (index % 2) ? this.formatX(num, event) : this.formatY(num, event)),
      stroke: colour || canvasElement.tool.colour || this.colour,
      strokeWidth: size || canvasElement.tool.size || this.size,
      hitStrokeWidth: this.hitStroke,
      id: canvasElement.id,
      lineJoin: 'round'
    })
  }
}
