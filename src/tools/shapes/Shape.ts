import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'
import { AppCanvasEntityActions, AppCanvasEntityGetters } from '@/store/modules/app/canvasEntity'
import store from '@/main'
import { AppLayerActions, AppLayerGetters } from '@/store/modules/app/layer'
import { Namespaces } from '@/store'

export default class Shape {
  private readonly decayTime = 500
  public group: Konva.Group
  constructor () {
    this.group = new Konva.Group()
  }

  getGroup = (): Konva.Group => this.group

  runTemporaryAnimation = (group: Konva.Group): void => {
    new Konva.Animation((frame) => {
      if (frame) {
        if ((frame.time / this.decayTime) > 1) {
          self.stop()
          group.destroyChildren()
        }
        const time = ((frame.time / this.decayTime) >= 1) ? 1 : (frame.time / this.decayTime)
        group.opacity(1 - time)
      }
    }, this.layer).start()
  }

  destroy = (): void => {
    store.dispatch(`${Namespaces.APP_LAYER}/${AppLayerActions.LAYER_DESTROY_GROUP}`, this.group)
  }

  formatX = (num: number, event: CustomEvent | CustomStageEvent): number => {
    return ((num / event.stageConfig.width) * event.stage.width())
  }

  formatY = (num: number, event: CustomEvent | CustomStageEvent): number => {
    return ((num / event.stageConfig.height) * event.stage.height())
  }

  get canvasElement (): CanvasElement {
    return store.getters[`${Namespaces.APP_CANVAS_ENTITY}/${AppCanvasEntityGetters.CANVAS_ELEMENT}`]
  }

  set canvasElement (canvasElement: CanvasElement) {
    store.dispatch(`${Namespaces.APP_CANVAS_ENTITY}(${AppCanvasEntityActions.SET_CANVAS_ELEMENT}`, canvasElement)
  }

  get layer (): Konva.Layer {
    return store.getters[`${Namespaces.APP_LAYER}/${AppLayerGetters.LAYER}`]
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
