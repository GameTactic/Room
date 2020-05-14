import Konva from 'konva'
import { CanvasElement, CanvasElementType } from '@/types/Canvas'
import Shape, { CircleCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'
import { CircleData } from '@/tools/Tool'

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

  create = (event: CustomEvent | CustomStageEvent, canvasElement?: CanvasElement): void => {
    if (!canvasElement) { canvasElement = this.canvasElement }
    this.group = new Konva.Group()
    if (this.showRadius && canvasElement.tool.showRadius) {
      this.layer.add(this.group.id(canvasElement.id)
        .add(this.circle = this.createCircleElement(canvasElement, event),
          this.line = this.createLineElement(canvasElement, event)
        )
      )
      this.group.attrs.type = CanvasElementType.SHAPE
    } else {
      this.layer.add(this.group.id(canvasElement.id).add(
        this.circle = this.createCircleElement(canvasElement, event)
      ))
      this.group.attrs.type = CanvasElementType.SHAPE
    }
  }
  // eslint-disable-next-line
  move = (event: CustomEvent | CustomStageEvent, canvasElement?: CanvasElement): void => {
    if (!canvasElement) { canvasElement = this.canvasElement }
    const data = canvasElement.data as CircleData
    this.circle.radius(
      this.calcRadius(
        this.formatX(data.from.x, event),
        this.formatY(data.from.y, event),
        this.formatX(data.to.x, event),
        this.formatY(data.to.y, event)
      )
    )
    if (canvasElement.tool.showRadius && this.line !== undefined) {
      this.line.points([
        this.formatX(data.from.x, event),
        this.formatY(data.from.y, event),
        this.formatX(data.to.x, event),
        this.formatY(data.to.y, event)]
      )
    }
  }

  createLineElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, outlineColour?: string, size?: number, strokeStyle?: number): Konva.Shape & Konva.Line => {
    const data = canvasElement.data as CircleData
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: [ data.from.x, data.from.y, data.to.x, data.to.y ],
      stroke: outlineColour || canvasElement.tool.outlineColour || this.outlineColour,
      strokeWidth: size || canvasElement.tool.size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id,
      hitStrokeWidth: this.hitStroke,
      dash: this.stroke[strokeStyle || canvasElement.tool.strokeStyle || this.strokeStyle || 0]
    })
  }

  createCircleElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, size?: number, radius?: number, strokeStyle?: number, outlineColour?: string): Konva.Shape & Konva.Circle => {
    const data = canvasElement.data as CircleData
    return new Konva.Circle({
      id: canvasElement.id,
      globalCompositeOperation: 'source-over',
      fill: colour || canvasElement.tool.colour || this.colour,
      stroke: outlineColour || canvasElement.tool.outlineColour || this.outlineColour,
      strokeWidth: size || canvasElement.tool.size || this.size,
      radius: radius || 0,
      x: this.formatX(data.from.x, event),
      y: this.formatY(data.from.y, event),
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
