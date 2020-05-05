import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'
import { CanvasEntityActions, CanvasEntityGetters } from '@/store/modules/canvasEntity'
import store from '@/main'
import { LayerGetters } from '@/store/modules/layer'

export default class Shape {
  private readonly decayTime = 1000
  public group: Konva.Group
  constructor () {
    this.group = new Konva.Group()
  }

  getGroup = (): Konva.Group => this.group

  runTemporaryAnimation = (group: Konva.Group): void => {
    const animate = new Konva.Animation((frame) => {
      if (frame) {
        group.opacity(1 - (frame.time / this.decayTime))
      }
    }, this.layer)
    animate.start()
    setTimeout(() => {
      group.destroy()
      animate.stop()
      this.layer.batchDraw()
    }, this.decayTime)
  }

  destroy = (): void => {
    const group: Konva.Collection<Konva.Node> = this.layer.getChildren(node => node.attrs.id === this.group.attrs.id)
    group.each(child => child.destroy())
    this.layer.batchDraw()
  }

  formatX = (num: number, event: CustomEvent | CustomStageEvent): number => {
    return ((num / event.stageConfig.width) * event.stage.width())
  }

  formatY = (num: number, event: CustomEvent | CustomStageEvent): number => {
    return ((num / event.stageConfig.height) * event.stage.height())
  }

  get canvasElement (): CanvasElement {
    return store.getters[`canvasEntity/${CanvasEntityGetters.CANVAS_ELEMENT}`]
  }

  set canvasElement (canvasElement: CanvasElement) {
    store.dispatch(`canvasEntity(${CanvasEntityActions.SET_CANVAS_ELEMENT}`, canvasElement)
  }

  get layer (): Konva.Layer {
    return store.getters[`layer/${LayerGetters.LAYER}`]
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
