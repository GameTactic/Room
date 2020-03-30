import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import Shape, { CircleCreatorInterface } from '@/tools/shapes/Shape'

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

  create = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.group = new Konva.Group()
    this.group.attrs.temporary = this.temporary
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

  destroy = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    const group: Konva.Collection<Konva.Node> = layer.getChildren(node => node.attrs.id === this.group.attrs.id)
    group.each(child => child.destroy())
    layer.batchDraw()
  }

  // eslint-disable-next-line
  [key: string]: any;
}

export interface Position {
  x: number;
  y: number;
}
