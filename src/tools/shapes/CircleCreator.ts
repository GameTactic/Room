import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { Shape } from '@/tools/shapes/Shape'

export default class CircleCreator implements Shape {
  private line: Konva.Line
  private circle: Konva.Circle
  private stroke: number[][]
  constructor (public size?: number,
               public colour?: string,
               public outlineColour?: string,
               public strokeStyle?: number,
               public temporary?: boolean,
               public showRadius?: boolean) {
    this.line = new Konva.Line()
    this.circle = new Konva.Circle()
    this.stroke = [
      [0, 0],
      [30, 10]
    ]
  }

  create = (canvasElement: CanvasElement, layer: Konva.Layer): CreateCircle => {
    if (this.showRadius && canvasElement.tool.showRadius) {
      this.line = this.createLineElement(canvasElement)
      this.circle = this.createCircleElement(canvasElement)
      layer.add(this.circle)
      layer.add(this.line)
      return {
        circle: this.circle,
        line: this.line
      }
    } else {
      this.circle = this.createCircleElement(canvasElement)
      layer.add(this.circle)
      return {
        circle: this.circle,
        line: undefined
      }
    }
  }

  // eslint-disable-next-line
  move = (canvasElement: CanvasElement, layer: Konva.Layer, pos: Position, circle: Konva.Circle, line?: Konva.Line): void => {
    circle.radius(this.calcRadius(canvasElement.data[0], canvasElement.data[1], pos.x, pos.y))
    if (canvasElement.tool.showRadius && line !== undefined) {
      line.points([canvasElement.data[0], canvasElement.data[1], pos.x, pos.y])
    }
  }

  createLineElement = (canvasElement: CanvasElement, outlineColour?: string, size?: number, strokeStyle?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data,
      stroke: outlineColour || this.outlineColour,
      strokeWidth: size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id,
      dash: this.stroke[strokeStyle || this.strokeStyle || 0]
    })
  }

  createCircleElement = (canvasElement: CanvasElement, colour?: string, stroke?: number, radius?: number, strokeStyle?: number, outlineColour?: string): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      id: canvasElement.id,
      globalCompositeOperation: 'source-over',
      fill: colour || this.colour,
      stroke: outlineColour || this.outlineColour,
      strokeWidth: stroke || this.size,
      radius: radius || 0,
      x: canvasElement.data[0],
      y: canvasElement.data[1],
      dash: this.stroke[strokeStyle || this.strokeStyle || 0]
    })
  }

  calcRadius = (x1: number, y1: number, x2: number, y2: number): number => {
    const a = Math.pow((x2 - x1), 2)
    const b = Math.pow((y2 - y1), 2)
    return Math.sqrt(a + b)
  }

  // eslint-disable-next-line
  [key: string]: any;
}

export interface CreateCircle {
  circle: Konva.Circle;
  line?: Konva.Line;
}

export interface Position {
  x: number;
  y: number;
}
