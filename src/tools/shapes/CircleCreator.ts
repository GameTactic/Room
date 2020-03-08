import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { Shape } from '@/tools/shapes/Shape'

export default class CircleCreator implements Shape {
  private line: Konva.Line
  private circle: Konva.Circle
  private group: Konva.Group
  private readonly hitStroke: number = 10
  private stroke: number[][] = [[0, 0], [30, 10]]
  constructor (public size?: number,
               public colour?: string,
               public outlineColour?: string,
               public strokeStyle?: number,
               public temporary?: boolean,
               public showRadius?: boolean) {
    this.line = new Konva.Line()
    this.circle = new Konva.Circle()
    this.group = new Konva.Group()
  }

  create = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.group = new Konva.Group()
    if (this.showRadius && canvasElement.tool.showRadius) {
      layer.add(this.group.id(canvasElement.id).add(
        this.circle = this.createCircleElement(canvasElement),
        this.line = this.createLineElement(canvasElement)
      ))
    } else {
      layer.add(this.group.id(canvasElement.id).add(
        this.circle = this.createCircleElement(canvasElement)
      ))
    }
  }
  // eslint-disable-next-line
  move = (canvasElement: CanvasElement, layer: Konva.Layer, pos: Position): void => {
    this.circle.radius(this.calcRadius(canvasElement.data[0], canvasElement.data[1], pos.x, pos.y))
    if (canvasElement.tool.showRadius && this.line !== undefined) {
      this.line.points([canvasElement.data[0], canvasElement.data[1], pos.x, pos.y])
    }
  }

  createLineElement = (canvasElement: CanvasElement, outlineColour?: string, size?: number, strokeStyle?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: outlineColour || canvasElement.tool.outlineColour || this.outlineColour,
      strokeWidth: size || canvasElement.tool.size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id,
      hitStrokeWidth: this.hitStroke,
      dash: this.stroke[strokeStyle || canvasElement.tool.strokeStyle || this.strokeStyle || 0]
    })
  }

  createCircleElement = (canvasElement: CanvasElement, colour?: string, size?: number, radius?: number, strokeStyle?: number, outlineColour?: string): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      id: canvasElement.id,
      globalCompositeOperation: 'source-over',
      fill: colour || canvasElement.tool.colour || this.colour,
      stroke: outlineColour || canvasElement.tool.outlineColour || this.outlineColour,
      strokeWidth: size || canvasElement.tool.size || this.size,
      radius: radius || 0,
      x: canvasElement.data[0],
      y: canvasElement.data[1],
      hitStrokeWidth: this.hitStroke,
      dash: this.stroke[strokeStyle || canvasElement.tool.strokeStyle || this.strokeStyle || 0]
    })
  }
  // Pythagoras formula
  calcRadius = (x1: number, y1: number, x2: number, y2: number): number => {
    const a = Math.pow((x2 - x1), 2)
    const b = Math.pow((y2 - y1), 2)
    return Math.sqrt(a + b)
  }

  // eslint-disable-next-line
  [key: string]: any;
}

export interface Position {
  x: number;
  y: number;
}
