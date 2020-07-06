import Konva from 'konva'
import { CanvasElementType, Point } from '@/types/canvas'
import Shape, { RulerCreatorInterface } from '@/tools/shapes/shape'
import { CustomStageConfig } from '@/util/pointerEventMapper'
import store from '@/main'
import { SocketStageGetters } from '@/store/modules/socket/stage'
import { Namespaces } from '@/store'
import { v4 as uuid } from 'uuid'

export default class RulerCreator extends Shape implements RulerCreatorInterface {
  private line: Konva.Line
  private text: Konva.Text
  private circle: Konva.Circle
  private readonly hitStroke: number = 10
  constructor (public temporary: boolean,
               public size: number,
               public colour: string,
               public showCircle: boolean,
               public groupId: string,
               public from: Point,
               public to: Point) {
    super()
    this.line = new Konva.Line()
    this.text = new Konva.Text()
    this.circle = new Konva.Circle()
  }

  create = (): void => {
    this.group = new Konva.Group()
    this.group.id(this.groupId).add(
      this.line = this.createLineElement(),
      this.text = this.createTextElement()
    )
    if (this.showCircle) {
      this.group.add(
        this.circle = this.createCircleElement()
      )
    }
    this.group.attrs.type = CanvasElementType.SHAPE
    this.group.attrs.temporary = this.temporary
    this.layer.add(this.group)
  }

  move = (from: Point, to: Point): void => {
    this.from = from
    this.to = to
    if (this.showCircle && this.circle) {
      this.circle.radius(this.calcRadius(this.from.x, this.from.y, this.to.x, this.to.y))
    }
    this.text.text(this.getText(this.calcRadius(this.from.x, this.from.y, this.to.x, this.to.y)))
    const textPos = this.calcTextPosition(this.from.x, this.from.y, this.to.x, this.to.y)
    this.text.x(textPos.x).y(textPos.y)
    this.line.points([this.from.x, this.from.y, this.to.x, this.to.y]
    )
  }

  createLineElement = (): Konva.Shape & Konva.Line => {
    return new Konva.Line({
      globalCompositeOperation: 'source-over',
      points: [ this.from.x, this.from.y, this.to.x, this.to.y ],
      stroke: this.colour,
      strokeWidth: this.size,
      lineCap: 'mitter',
      id: uuid(),
      hitStrokeWidth: this.hitStroke,
      dash: [15, 5]
    })
  }

  createTextElement = (): Konva.Shape & Konva.Text => {
    return new Konva.Text({
      id: uuid(),
      x: this.from.x,
      y: this.from.y,
      text: this.getText(this.calcRadius(this.from.x, this.from.y, this.to.x, this.to.y)) || '0 km',
      fontSize: 20,
      fontFamily: 'Calibri',
      hitStrokeWidth: this.hitStroke,
      fill: this.colour
    })
  }

  createCircleElement = (): Konva.Shape & Konva.Circle => {
    return new Konva.Circle({
      id: uuid(),
      globalCompositeOperation: 'source-over',
      stroke: this.colour,
      strokeWidth: this.size,
      radius: this.calcRadius(this.from.x, this.from.y, this.to.x, this.to.y),
      hitStrokeWidth: this.hitStroke,
      x: this.from.x,
      y: this.from.y
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

  getText = (radius: number): string => {
    const stageConfig: CustomStageConfig = store.getters[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`]
    const range = Math.floor(radius / (stageConfig.initialWidth * 0.75) * stageConfig.mapRatio * 10) / 10
    return (range !== 0) ? `${range} km` : '? km'
  }

  // eslint-disable-next-line
  [key: string]: any;
}

export interface Position {
  x: number;
  y: number;
}
