import Konva from 'konva'
import { CanvasElementType, Point } from '@/types/canvas'
import Shape, { CircleCreatorInterface } from '@/tools/shapes/shape'
import uuid from 'uuid'

export default class CircleCreator extends Shape implements CircleCreatorInterface {
  private line: Konva.Line
  private circle: Konva.Circle
  private readonly hitStroke: number = 10
  private stroke: number[][] = [[0, 0], [30, 10]]
  constructor (public temporary: boolean,
               public size: number,
               public colour: string,
               public outlineColour: string,
               public strokeStyle: number,
               public showRadius: boolean,
               public groupId: string,
               public from: Point,
               public to: Point) {
    super()
    this.line = new Konva.Line()
    this.circle = new Konva.Circle()
  }

  create = (): void => {
    this.group = new Konva.Group()
    if (this.showRadius) {
      this.layer.add(this.group.id(this.groupId)
        .add(this.circle = this.createCircleElement(),
          this.line = this.createLineElement()
        )
      )
    } else {
      this.layer.add(this.group.id(this.groupId).add(
        this.circle = this.createCircleElement()
      ))
    }
    this.group.attrs.type = CanvasElementType.SHAPE
    this.group.attrs.temporary = this.temporary
  }

  move = (from: Point, to: Point): void => {
    this.from = from
    this.to = to
    this.circle.radius(this.calcRadius(this.from.x, this.from.y, this.to.x, this.to.y))
    if (this.showRadius) {
      this.line.points([this.from.x, this.from.y, this.to.x, this.to.y])
    }
  }

  createLineElement = (): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: [ this.from.x, this.from.y, this.to.x, this.to.y ],
      stroke: this.outlineColour,
      strokeWidth: this.size,
      lineCap: 'mitter',
      id: uuid(),
      hitStrokeWidth: this.hitStroke,
      dash: this.stroke[this.strokeStyle]
    })
  }

  createCircleElement = (): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      id: uuid(),
      globalCompositeOperation: 'source-over',
      fill: this.colour,
      stroke: this.outlineColour,
      strokeWidth: this.size,
      radius: this.calcRadius(this.from.x, this.from.y, this.to.x, this.to.y),
      x: this.from.x,
      y: this.from.y,
      hitStrokeWidth: this.hitStroke,
      dash: this.stroke[this.strokeStyle]
    })
  }
  // Pythagoras formula
  calcRadius = (x1: number, y1: number, x2: number, y2: number): number => {
    const a = Math.pow((x2 - x1), 2)
    const b = Math.pow((y2 - y1), 2)
    return Math.sqrt(a + b)
  }
}
