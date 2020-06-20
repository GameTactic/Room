import Konva from 'konva'
import { CanvasElementType } from '@/types/Canvas'
import Shape, { FreeDrawCreatorInterface } from '@/tools/shapes/Shape'
import uuid from 'uuid'

export default class FreeDrawCreator extends Shape implements FreeDrawCreatorInterface {
  private freeDraw: Konva.Line
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size: number,
               public colour: string,
               public groupId: string,
               public points: number[]) {
    super()
    this.freeDraw = new Konva.Line()
  }

  create = (): void => {
    this.group.id(this.groupId).add(
      this.freeDraw = this.createFreeDrawElement()
    )
    this.group.attrs.type = CanvasElementType.SHAPE
    this.group.attrs.temporary = this.temporary
    this.layer.add(this.group)
  }

  move = (points: number[]): void => {
    this.points = points
    this.freeDraw.points(this.points)
  }

  createFreeDrawElement = (): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: this.points,
      stroke: this.colour,
      strokeWidth: this.size,
      hitStrokeWidth: this.hitStroke,
      id: uuid(),
      lineJoin: 'round'
    })
  }
}
