import Konva from 'konva'
import { CanvasElementType, Point } from '@/types/canvas'
import Shape, { LineCreatorInterface } from '@/tools/shapes/shape'
import { LineType } from '@/tools/line'
import { v4 as uuid } from 'uuid'

export default class LineCreator extends Shape implements LineCreatorInterface {
  private line: Konva.Line
  private tBar: Konva.Line | undefined
  private readonly stroke: number[][]
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size: number,
               public colour: string,
               public strokeStyle: number,
               public groupId: string,
               public from: Point,
               public to: Point,
               public endStyle: LineType) {
    super()
    this.line = new Konva.Line()
    this.stroke = [
      [0, 0],
      [5, 2]
    ]
  }

  create = (): void => {
    this.group = new Konva.Group()
    this.group.id(this.groupId)
    const result: { line: Konva.Line; tBar: Konva.Line | undefined } = this.createElement()
    this.group.add(result.line)
    this.line = result.line
    if (this.endStyle === LineType.T_BAR && result.tBar) {
      this.group.add(result.tBar)
      this.tBar = result.tBar
    }
    this.group.attrs.type = CanvasElementType.SHAPE
    this.group.attrs.temporary = this.temporary
    this.layer.add(this.group)
  }

  createElement = (): { line: Konva.Line; tBar: Konva.Line | undefined } => {
    const line = this.createKonvaElement(
      this.endStyle,
      [this.from.x, this.from.y, this.to.x, this.to.y],
      [this.stroke[this.strokeStyle][0] * this.size, this.stroke[this.strokeStyle][1] * this.size])
    if (this.endStyle === LineType.T_BAR) {
      const tBar = this.createKonvaElement(
        LineType.LINE,
        this.calcTBar(this.from.x, this.from.y, this.to.x, this.to.y)
      )
      return {
        tBar: tBar,
        line: line
      }
    } else {
      return {
        line: line,
        tBar: undefined
      }
    }
  }

  createKonvaElement = (type: LineType, points: number[], dash?: number[]): Konva.Line => {
    const konvaType = { line: Konva.Line, arrow: Konva.Arrow, tBar: Konva.Line }
    return new konvaType[type]({
      globalCompositeOperation: 'source-over',
      points: points,
      stroke: this.colour,
      strokeWidth: this.size,
      lineCap: 'mitter',
      id: uuid(),
      hitStrokeWidth: this.hitStroke,
      dash: dash
    })
  }

  move = (from: Point, to: Point): void => {
    this.from = from
    this.to = to
    this.line.points([this.from.x, this.from.y, this.to.x, this.to.y])
    if (this.endStyle === LineType.T_BAR && this.tBar) {
      this.tBar.points(this.calcTBar(this.from.x, this.from.y, this.to.x, this.to.y))
    }
  }

  calcTBar = (x1: number, y1: number, x2: number, y2: number): number[] => {
    // Checking for empty fields
    if (x2 === null || y2 === null || x2 === undefined || y2 === undefined) {
      // If empty fields, return [0, 0] (Line will not be drawn)
      return [0, 0]
    } else {
      // The length of one of the lines in the T bar. Full length of T bar will be twice the distance
      const distance = 15
      // Finding x and y vectors and make them point the right way
      const xVector = (-1 * (x2 - x1))
      const yVector = (-1 * (y2 - y1))
      // One vector cant be 0, return [0, 0] if so (Line won't be drawn)
      if (xVector === 0 || yVector === 0) {
        return [0, 0]
      } else {
        // Defines vector AB
        let AB = []
        // Factorizing x and y
        if (Math.abs(xVector) < Math.abs(yVector)) {
          AB = [xVector / yVector, 1]
        } else {
          AB = [1, yVector / xVector]
        }
        // Inversing the vector
        const ABInv = [AB[1] * -1, AB[0]]
        // Finding the length of the T bar. It will most likely be >distance
        const length = Math.sqrt(Math.pow(ABInv[0] * distance, 2) + Math.pow(ABInv[1] * distance, 2))
        // Offset variable makes sure the length of the T bar dont vary too much
        const offset = distance - ((length - distance) / Math.sqrt(2))
        // Calculating points where T bar should be drawn
        const xx1 = x2 + ABInv[0] * offset
        const yy1 = y2 + ABInv[1] * offset
        const xx2 = x2 + ABInv[0] * -offset
        const yy2 = y2 + ABInv[1] * -offset
        // Returning points for T bar
        return [xx1, yy1, xx2, yy2]
      }
    }
  }
}
