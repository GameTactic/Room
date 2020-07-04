import Konva from 'konva'
import { Point } from '@/types/canvas'
import { CustomStageConfig } from '@/util/pointerEventMapper'
import store from '@/main'
import { AppLayerActions, AppLayerGetters } from '@/store/modules/app/layer'
import { Namespaces } from '@/store'
import { LineType } from '@/tools/line'
import { SocketStageGetters } from '@/store/modules/socket/stage'

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

  get layer (): Konva.Layer {
    return store.getters[`${Namespaces.APP_LAYER}/${AppLayerGetters.LAYER}`]
  }

  get stageConfig (): CustomStageConfig {
    return store.getters[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`]
  }
}

export interface ShapeInterface {
  temporary: boolean;
  groupId: string;
  // eslint-disable-next-line
  [key: string]: any;
}

export interface CircleCreatorInterface extends ShapeInterface {
  size: number;
  colour: string;
  outlineColour: string;
  strokeStyle: number;
  showRadius: boolean;
  from: Point;
  to: Point;
}

export interface FreeDrawCreatorInterface extends ShapeInterface {
  size: number;
  colour: string;
}

export interface LineCreatorInterface extends ShapeInterface {
  size: number;
  colour: string;
  strokeStyle: number;
  from: Point;
  to: Point;
  endStyle: LineType;
}

export interface PingCreatorInterface extends ShapeInterface {
  size: number;
  colour: string;
  point: Point;
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
  point: Point;
}
