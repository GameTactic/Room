import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import Shape, { CircleCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

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
               public showRadius: boolean) {
    super()
    this.line = new Konva.Line()
    this.circle = new Konva.Circle()
  }

  create = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    this.group = new Konva.Group()
    this.group.attrs.temporary = this.temporary
    if (this.showRadius && canvasElement.tool.showRadius) {
      layer.add(this.group.id(canvasElement.id).add(
        this.circle = this.createCircleElement(canvasElement, event),
        this.line = this.createLineElement(canvasElement, event)
      ))
    } else {
      layer.add(this.group.id(canvasElement.id).add(
        this.circle = this.createCircleElement(canvasElement, event)
      ))
    }
  }
  // eslint-disable-next-line
  move = (canvasElement: CanvasElement, layer: Konva.Layer, pos: Position, event: CustomEvent | CustomStageEvent): void => {
    this.circle.radius(
      this.calcRadius(
        this.formatX(canvasElement.data[0], event),
        this.formatY(canvasElement.data[1], event),
        this.formatX(pos.x, event),
        this.formatY(pos.y, event)
      )
    )
    if (canvasElement.tool.showRadius && this.line !== undefined) {
      this.line.points([
        this.formatX(canvasElement.data[0], event),
        this.formatY(canvasElement.data[1], event),
        this.formatX(pos.x, event),
        this.formatY(pos.y, event)]
      )
    }
  }

  createLineElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, outlineColour?: string, size?: number, strokeStyle?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data.map((num, index) => (index % 2) ? this.formatX(num, event) : this.formatY(num, event)),
      stroke: outlineColour || canvasElement.tool.outlineColour || this.outlineColour,
      strokeWidth: size || canvasElement.tool.size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id,
      hitStrokeWidth: this.hitStroke,
      dash: this.stroke[strokeStyle || canvasElement.tool.strokeStyle || this.strokeStyle || 0]
    })
  }

  createCircleElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, size?: number, radius?: number, strokeStyle?: number, outlineColour?: string): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      id: canvasElement.id,
      globalCompositeOperation: 'source-over',
      fill: colour || canvasElement.tool.colour || this.colour,
      stroke: outlineColour || canvasElement.tool.outlineColour || this.outlineColour,
      strokeWidth: size || canvasElement.tool.size || this.size,
      radius: radius || 0,
      x: this.formatX(canvasElement.data[0], event),
      y: this.formatY(canvasElement.data[1], event),
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
