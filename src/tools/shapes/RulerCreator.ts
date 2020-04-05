import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import Shape, { RulerCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class RulerCreator extends Shape implements RulerCreatorInterface {
  private line: Konva.Line
  private text: Konva.Text
  private circle: Konva.Circle
  private readonly hitStroke: number = 10
  private readonly mapRatio: number
  constructor (public temporary: boolean,
               public size: number,
               public colour: string,
               public showCircle: boolean) {
    super()
    this.line = new Konva.Line()
    this.text = new Konva.Text()
    this.circle = new Konva.Circle()
    this.mapRatio = 1
  }

  create = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    this.group = new Konva.Group()
    this.group.attrs.temporary = this.temporary
    if (this.showCircle && canvasElement.tool.showCircle) {
      this.group.id(canvasElement.id).add(
        this.line = this.createLineElement(canvasElement, event),
        this.text = this.createTextElement(canvasElement, event),
        this.circle = this.createCircleElement(canvasElement, event)
      )
    } else {
      this.group.id(canvasElement.id).add(
        this.line = this.createLineElement(canvasElement, event),
        this.text = this.createTextElement(canvasElement, event)
      )
    }
    layer.add(this.group)
  }

  move = (canvasElement: CanvasElement, layer: Konva.Layer, pos: Position, event: CustomEvent | CustomStageEvent): void => {
    if (canvasElement.tool.showCircle && this.circle !== undefined) {
      this.circle.radius(this.calcRadius(
        this.formatX(canvasElement.data[0], event),
        this.formatY(canvasElement.data[1], event),
        this.formatX(pos.x, event),
        this.formatY(pos.y, event)
      ))
    }
    this.text.text(this.getText(this.calcRadius(
      this.formatX(canvasElement.data[0], event),
      this.formatY(canvasElement.data[1], event),
      this.formatX(pos.x, event),
      this.formatY(pos.y, event)
    )))
    const textPos = this.calcTextPosition(
      this.formatX(canvasElement.data[0], event),
      this.formatY(canvasElement.data[1], event),
      this.formatX(pos.x, event),
      this.formatY(pos.y, event)
    )
    this.text.x(textPos.x).y(textPos.y)
    this.line.points([
      this.formatX(canvasElement.data[0], event),
      this.formatY(canvasElement.data[1], event),
      this.formatX(pos.x, event),
      this.formatY(pos.y, event)
    ]
    )
  }

  createLineElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: canvasElement.data.map((num) => (num % 2) ? this.formatX(num, event) : this.formatY(num, event)),
      stroke: colour || this.colour,
      strokeWidth: size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id,
      hitStrokeWidth: this.hitStroke,
      dash: [15, 5]
    })
  }

  createTextElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, text?: string, colour?: string): Konva.Shape & Konva.Text => {
    return new Konva.Text({
      id: canvasElement.id,
      x: this.formatX(canvasElement.data[0], event),
      y: this.formatY(canvasElement.data[1], event),
      text: text || '0 m',
      fontSize: 20,
      fontFamily: 'Calibri',
      hitStrokeWidth: this.hitStroke,
      fill: colour || this.colour
    })
  }

  createCircleElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, stroke?: number, radius?: number): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      id: canvasElement.id,
      globalCompositeOperation: 'source-over',
      stroke: colour || this.colour,
      strokeWidth: stroke || this.size,
      radius: radius || 0,
      hitStrokeWidth: this.hitStroke,
      x: this.formatX(canvasElement.data[0], event),
      y: this.formatY(canvasElement.data[1], event)
    })
  }

  calcTextPosition = (x1: number, y1: number, x2: number, y2: number): Position => {
    if ((x1 - x2) === 0 && (y1 - y2) === 0) {
      return {
        x: x1,
        y: y1
      }
    } else {
      const offset = 30
      const offsetX = (x1 - x2) / 2
      const offsetY = (y1 - y2) / 2
      const angleX = -(y1 - y2) / (this.calcRadius(x1, y1, x2, y2))
      const angleY = (x1 - x2) / (this.calcRadius(x1, y1, x2, y2))

      const response = {
        x: x2 + offsetX + (angleX * offset) - (this.text.getWidth() / 2),
        y: y2 + offsetY + (angleY * offset) - (this.text.getHeight() / 2)
      }
      return {
        x: (response.x >= 0) ? response.x : 0,
        y: (response.y >= 0) ? response.y : 0
      }
    }
  }

  calcRadius = (x1: number, y1: number, x2: number, y2: number): number => {
    const a = Math.pow((x2 - x1), 2)
    const b = Math.pow((y2 - y1), 2)
    return Math.sqrt(a + b)
  }

  getText = (radius: number): string => {
    return Math.floor(radius * this.mapRatio) + ' m'
  }

  // eslint-disable-next-line
  [key: string]: any;
}

export interface Position {
  x: number;
  y: number;
}
