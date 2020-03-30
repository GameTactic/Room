import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { Shape } from '@/tools/shapes/Shape'

export default class LineCreator implements Shape {
  private line: Konva.Line
  private arrow: Konva.Arrow
  private tBar: Konva.Line
  private group: Konva.Group
  private stroke: number[][]
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size?: number,
               public colour?: string,
               public strokeStyle?: number) {
    this.line = new Konva.Line()
    this.arrow = new Konva.Arrow()
    this.tBar = new Konva.Line()
    this.group = new Konva.Group()
    this.stroke = [
      [0, 0],
      [30, 10]
    ]
  }

  createLINE = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.group = new Konva.Group()
    this.group.attrs.temporary = this.temporary
    this.group.id(canvasElement.id).add(
      this.line = this.createLineElement(canvasElement)
    )
    layer.add(this.group)
  }

  createARROW = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.group = new Konva.Group()
    this.group.id(canvasElement.id).add(
      this.arrow = this.createArrowElement(canvasElement)
    )
    layer.add(this.group)
  }

  createTBAR = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.group = new Konva.Group()
    this.group.id(canvasElement.id).add(
      this.line = this.createLineElement(canvasElement),
      this.tBar = this.createTElement(canvasElement)
    )
    layer.add(this.group)
  }

  // eslint-disable-next-line
  moveLINE = (canvasElement: CanvasElement, layer: Konva.Layer, pos: any): void => {
    this.line.points([canvasElement.data[0], canvasElement.data[1], pos.x, pos.y])
  }

  // eslint-disable-next-line
  moveARROW = (canvasElement: CanvasElement, layer: Konva.Layer, pos: any): void => {
    this.arrow.points([canvasElement.data[0], canvasElement.data[1], pos.x, pos.y])
  }

  // eslint-disable-next-line
  moveTBAR = (canvasElement: CanvasElement, layer: Konva.Layer, pos: any): void => {
    this.tBar.points(this.calcTBar(canvasElement.data[0], canvasElement.data[1], pos.x, pos.y))
    this.line.points([canvasElement.data[0], canvasElement.data[1], pos.x, pos.y])
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
      // One vector cant be 0, return [0, 0] if thats the case (Line will not be drawn)
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

  createLineElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: colour || canvasElement.tool.colour || this.colour,
      strokeWidth: size || canvasElement.tool.size || this.size || 5,
      lineCap: 'mitter',
      id: canvasElement.id,
      hitStrokeWidth: this.hitStroke,
      dash: this.stroke[canvasElement.tool.strokeStyle || this.strokeStyle || 0]
    })
  }

  createTElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    const point = this.calcTBar(canvasElement.data[0], canvasElement.data[1], canvasElement.data[2], canvasElement.data[3])
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: point,
      stroke: colour || canvasElement.tool.colour || this.colour,
      strokeWidth: size || canvasElement.tool.size || this.size || 5,
      lineCap: 'mitter',
      hitStrokeWidth: this.hitStroke,
      id: canvasElement.id
    })
  }

  createArrowElement = (canvasElement: CanvasElement, colour?: string, size?: number): Konva.Shape & Konva.Arrow => {
    return new Konva.Arrow({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: colour || canvasElement.tool.colour || this.colour,
      strokeWidth: size || canvasElement.tool.size || this.size || 5,
      lineCap: 'mitter',
      id: canvasElement.id,
      hitStrokeWidth: this.hitStroke,
      dash: this.stroke[canvasElement.tool.strokeStyle || this.strokeStyle || 0],
      fill: canvasElement.tool.colour || this.colour
    })
  }

  destroy = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    const group: Konva.Collection<Konva.Node> = layer.getChildren(node => node.attrs.id === this.group.attrs.id)
    group.each(child => child.destroy())
    layer.batchDraw()
  }

  // eslint-disable-next-line
  [key: string]: any;
}
