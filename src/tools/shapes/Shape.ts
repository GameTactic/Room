import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'

export default class Shape {
  private readonly decayTime = 1000
  public group: Konva.Group
  constructor () {
    this.group = new Konva.Group()
  }

  getGroup = (): Konva.Group => this.group

  runTemporaryAnimation = (group: Konva.Group, layer: Konva.Layer): void => {
    const animate = new Konva.Animation((frame) => {
      if (frame) {
        group.opacity(1 - (frame.time / this.decayTime))
      }
    }, layer)
    animate.start()
    setTimeout(() => {
      group.destroy()
      animate.stop()
      layer.batchDraw()
    }, this.decayTime)
  }

  destroy = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    const group: Konva.Collection<Konva.Node> = layer.getChildren(node => node.attrs.id === this.group.attrs.id)
    group.each(child => child.destroy())
    layer.batchDraw()
  }
}

export interface ShapeInterface {
  temporary: boolean;
  // eslint-disable-next-line
  [key: string]: any;
}

export interface CircleCreatorInterface extends ShapeInterface {
  size: number;
  colour: string;
  outlineColour: string;
  strokeStyle: number;
  showRadius: boolean;
}

export interface FreeDrawCreatorInterface extends ShapeInterface {
  size: number;
  colour: string;
}

export interface LineCreatorInterface extends ShapeInterface {
  size: number;
  colour: string;
  strokeStyle: number;
}

export interface PingCreatorInterface extends ShapeInterface {
  size: number;
  colour: string;
}

export interface RulerCreatorInterface extends ShapeInterface {
  size: number;
  colour: string;
  showCircle: boolean;
}

export interface TextCreatorInterface extends ShapeInterface {
  size: number;
  colour: string;
  textString: string;
}
