import Konva from 'konva'
import { CanvasElement, CanvasElementType } from '@/types/Canvas'
import Shape, { RulerCreatorInterface } from '@/tools/shapes/Shape'
import { CustomEvent, CustomStageConfig, CustomStageEvent } from '@/util/PointerEventMapper'
import store from '@/main'
import { StageGetters } from '@/store/modules/stage'
import { RulerData } from '@/tools/Tool'

export default class RulerCreator extends Shape implements RulerCreatorInterface {
  private line: Konva.Line
  private text: Konva.Text
  private circle: Konva.Circle
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size: number,
               public colour: string,
               public showCircle: boolean) {
    super()
    this.line = new Konva.Line()
    this.text = new Konva.Text()
    this.circle = new Konva.Circle()
  }

  create = (event: CustomEvent | CustomStageEvent, canvasElement?: CanvasElement): void => {
    if (!canvasElement) { canvasElement = this.canvasElement }
    this.group = new Konva.Group()
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
    this.group.attrs.type = CanvasElementType.SHAPE
    this.layer.add(this.group)
  }

  move = (event: CustomEvent | CustomStageEvent, canvasElement?: CanvasElement): void => {
    if (!canvasElement) { canvasElement = this.canvasElement }
    const data = canvasElement.data as RulerData
    if (canvasElement.tool.showCircle && this.circle !== undefined) {
      this.circle.radius(this.calcRadius(
        this.formatX(data.from.x, event),
        this.formatY(data.from.y, event),
        this.formatX(data.to.x, event),
        this.formatY(data.to.y, event)
      ))
    }
    this.text.text(this.getText(this.calcRadius(
      this.formatX(data.from.x, event),
      this.formatY(data.from.y, event),
      this.formatX(data.to.x, event),
      this.formatY(data.to.y, event)
    ), event))
    const textPos = this.calcTextPosition(
      this.formatX(data.from.x, event),
      this.formatY(data.from.y, event),
      this.formatX(data.to.x, event),
      this.formatY(data.to.y, event)
    )
    this.text.x(textPos.x).y(textPos.y)
    this.line.points([
      this.formatX(data.from.x, event),
      this.formatY(data.from.y, event),
      this.formatX(data.to.x, event),
      this.formatY(data.to.y, event)
    ]
    )
  }

  createLineElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, size?: number): Konva.Shape & Konva.Line => {
    const data = canvasElement.data as RulerData
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: [ data.from.x, data.from.y, data.to.x, data.to.y ],
      stroke: colour || this.colour,
      strokeWidth: size || this.size,
      lineCap: 'mitter',
      id: canvasElement.id,
      hitStrokeWidth: this.hitStroke,
      dash: [15, 5]
    })
  }

  createTextElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, text?: string, colour?: string): Konva.Shape & Konva.Text => {
    const data = canvasElement.data as RulerData
    return new Konva.Text({
      id: canvasElement.id,
      x: this.formatX(data.from.x, event),
      y: this.formatY(data.from.y, event),
      text: text || '0 km',
      fontSize: 20,
      fontFamily: 'Calibri',
      hitStrokeWidth: this.hitStroke,
      fill: colour || this.colour
    })
  }

  createCircleElement = (canvasElement: CanvasElement, event: CustomEvent | CustomStageEvent, colour?: string, stroke?: number, radius?: number): Konva.Shape & Konva.Circle => {
    const data = canvasElement.data as RulerData
    return new Konva.Circle({
      id: canvasElement.id,
      globalCompositeOperation: 'source-over',
      stroke: colour || this.colour,
      strokeWidth: stroke || this.size,
      radius: radius || 0,
      hitStrokeWidth: this.hitStroke,
      x: this.formatX(data.from.x, event),
      y: this.formatY(data.from.y, event)
    })
  }

  // I'd explain if I could
  calcTextPosition = (x1: number, y1: number, x2: number, y2: number): Position => {
    if ((x1 - x2) === 0 && (y1 - y2) === 0) {
      return { x: Math.abs(x1), y: Math.abs(y1) }
    } else {
      const offset = 30
      const offsetX = (x1 - x2) / 2
      const offsetY = (y1 - y2) / 2
      const angleX = -(y1 - y2) / (this.calcRadius(x1, y1, x2, y2))
      const angleY = (x1 - x2) / (this.calcRadius(x1, y1, x2, y2))
      return {
        x: Math.abs(x2 + offsetX + (angleX * offset) - (this.text.getWidth() / 2)),
        y: Math.abs(y2 + offsetY + (angleY * offset) - (this.text.getHeight() / 2))
      }
    }
  }

  calcRadius = (x1: number, y1: number, x2: number, y2: number): number => {
    const a = Math.pow((x2 - x1), 2)
    const b = Math.pow((y2 - y1), 2)
    return Math.sqrt(a + b)
  }

  getText = (radius: number, event: CustomEvent | CustomStageEvent): string => {
    const stageConfig: CustomStageConfig = store.getters[`stage/${StageGetters.STAGE_CONFIG}`]
    const range = Math.floor(this.formatX(radius, event) / (event.stageConfig.initialWidth * 0.75) * stageConfig.mapRatio * 10) / 10
    return (range !== 0) ? `${range} km` : '? km'
  }

  // eslint-disable-next-line
  [key: string]: any;
}

export interface Position {
  x: number;
  y: number;
}
