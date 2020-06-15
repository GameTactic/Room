import Konva from 'konva'
import {
  AdditionData,
  CanvasElement,
  MoveData,
  Point,
  RemovalData,
  RequestCanvasEntity,
  VueKonvaStage
} from '@/types/Canvas'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'
import store from '@/main'
import { SocketActions } from '@/store/modules/socket'
import { SocketStageGetters } from '@/store/modules/socket/stage'
import { AppStageGetters } from '@/store/modules/app/stage'
import { AppCanvasEntityActions, AppCanvasEntityGetters, AppCanvasEntityState } from '@/store/modules/app/canvasEntity'
import { AppLayerGetters } from '@/store/modules/app/layer'
import { AppToolGetters, AppToolsAction } from '@/store/modules/app/tools'
import { SocketCanvasAction, SocketCanvasGetters } from '@/store/modules/socket/canvas'
import { Dimensions } from '@/mixins/StageWatcher'
import { Item } from '@/types/Games/Index'
import { Namespaces } from '@/store'

export type CanvasDownAction = (event: CustomEvent, stage: VueKonvaStage) => void;
export type CanvasMoveAction = (event: CustomEvent, stage: VueKonvaStage) => void;
export type CanvasUpAction = (event: CustomEvent, stage: VueKonvaStage) => void;
export type MouseDownAction = (event: CustomEvent) => void;
export type MouseMoveAction = (event: CustomEvent) => void;
export type MouseUpAction = (event: CustomEvent) => void;
export type RenderCanvas = (request: RequestCanvasEntity) => void;

export enum Tracker {
  ADDITION = 'addition',
  REMOVAL = 'removal',
  REDO = 'redo',
  UNDO = 'undo',
  MOVE = 'move'
}

export class ToolClass {
  get enabled (): boolean {
    return store.getters[`${Namespaces.APP_TOOLS}/${AppToolGetters.ENABLED}`]
  }

  disableTool = (): void => {
    store.dispatch(`${Namespaces.APP_TOOLS}/${AppToolsAction.DISABLE}`)
  }

  enableTool = (): void => {
    store.dispatch(`${Namespaces.APP_TOOLS}/${AppToolsAction.ENABLE}`)
  }

  sendAndAddToState = (request: RequestCanvasEntity, emit: string): void => {
    this.send(request, emit)
    this.addToState(request)
  }

  addToState = (request: RequestCanvasEntity): void => {
    switch (request.modifyType) {
      case Tracker.ADDITION:
        const additionsData = request.modifyData as AdditionData
        if (request.canvasElements.length === additionsData.additions.length && request.canvasElements.length > 0) {
          store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, {
            jti: request.jti,
            id: request.id,
            modifyType: request.modifyType,
            modifyData: request.modifyData,
            timestampModified: request.timestampModified
          })
          request.canvasElements.forEach((canvasElement: CanvasElement) => {
            store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.ADD_CANVAS_ELEMENT}`, { ...canvasElement })
          })
        }
        break
      case Tracker.REMOVAL:
        const removalsData = request.modifyData as RemovalData
        if (removalsData.removals && removalsData.removals.length > 0) {
          const canvasElements = store.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS}`]
          if (canvasElements) {
            removalsData.removals.forEach((groupId: string) => {
              const foundElement: CanvasElement = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
              if (foundElement) {
                store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.HIDE_CANVAS_ELEMENT}`, foundElement)
              }
            })
            store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, {
              jti: request.jti,
              id: request.id,
              modifyType: request.modifyType,
              modifyData: request.modifyData,
              timestampModified: request.timestampModified
            })
          }
        }
        break
      case Tracker.MOVE:
        const moveData = request.modifyData as MoveData
        if (moveData.to && moveData.from && moveData.groups.length > 0) {
          const canvasElements = store.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS}`]
          if (canvasElements) {
            moveData.groups.forEach((groupId: string) => {
              const foundElement: CanvasElement = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
              if (foundElement) {
                store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.MOVE_CANVAS_ELEMENT}`, {
                  id: groupId,
                  from: moveData.from,
                  to: moveData.to
                })
              }
            })
            store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, {
              jti: request.jti,
              id: request.id,
              modifyType: request.modifyType,
              modifyData: request.modifyData,
              timestampModified: request.timestampModified
            })
          }
        }
        break
    }
  }

  send = (request: RequestCanvasEntity, emit: string): void => {
    store.dispatch(`${Namespaces.SOCKET}/${SocketActions.EMIT}`, { data: request, emit: emit })
  }

  get stageEvent (): CustomStageEvent {
    return {
      stage: store.getters?.[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`],
      stageConfig: store.getters?.[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`],
      zoom: store.getters?.[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE_ZOOM}`]
    }
  }

  resetCanvasEntity = (): AppCanvasEntityState => {
    store.dispatch(`${Namespaces.APP_CANVAS_ENTITY}/${AppCanvasEntityActions.RESET_CANVAS_ENTITY}`)
    return store.getters[`${Namespaces.APP_CANVAS_ENTITY}/${AppCanvasEntityGetters.CANVAS_ENTITY}`]
  }

  get canvasElement (): CanvasElement {
    return store.getters[`${Namespaces.APP_CANVAS_ENTITY}/${AppCanvasEntityGetters.CANVAS_ELEMENT}`]
  }

  set canvasElement (canvasElement: CanvasElement) {
    store.dispatch(`${Namespaces.APP_CANVAS_ENTITY}/${AppCanvasEntityActions.SET_CANVAS_ELEMENT}`, canvasElement)
  }

  get canvasEntity (): AppCanvasEntityState {
    return store.getters[`${Namespaces.APP_CANVAS_ENTITY}/${AppCanvasEntityGetters.CANVAS_ENTITY}`]
  }

  set canvasEntity (canvasEntity: AppCanvasEntityState) {
    store.dispatch(`${Namespaces.APP_CANVAS_ENTITY}/${AppCanvasEntityActions.SET_CANVAS_ENTITY}`, canvasEntity)
  }

  get layer (): Konva.Layer {
    return store.getters[`${Namespaces.APP_LAYER}/${AppLayerGetters.LAYER}`]
  }

  get canvasElements (): CanvasElement[] {
    return store.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS}`]
  }
}

export interface Tool {
  name: string;
  temporary: boolean;
  // eslint-disable-next-line
  [key: string]: any
}

export interface CanvasToolInterface extends Tool {
  canvasDownAction: CanvasDownAction;
  canvasMoveAction: CanvasMoveAction;
  canvasUpAction: CanvasUpAction;
}

export interface ToolClassInterface extends Tool {
  mouseDownAction: MouseDownAction;
  mouseMoveAction: MouseMoveAction;
  mouseUpAction: MouseUpAction;
  renderCanvas: RenderCanvas;
}

export interface CircleInterface extends ToolClassInterface {
  colour: string;
  size: number;
  strokeStyle: number;
  outlineColour: string;
  showRadius: boolean;
}

export interface LineInterface extends ToolClassInterface {
  colour: string;
  size: number;
  endStyle: string;
  strokeStyle: number;
}

export interface PingInterface extends ToolClassInterface {
  colour: string;
  size: number;
}

export interface FreeDrawInterface extends ToolClassInterface {
  colour: string;
  size: number;
}

export interface RulerInterface extends ToolClassInterface {
  colour: string;
  size: number;
  showCircle: boolean;
}

export interface TextInterface extends ToolClassInterface {
  colour: string;
  size: number;
  textString: string;
}

export interface TextData {
  point: Point;
}

export interface RulerData {
  from: Point;
  to: Point;
}

export interface CircleData {
  from: Point;
  to: Point;
}

export interface LineData {
  from: Point;
  to: Point;
}

export interface PingData {
  point: Point;
}

export interface FreeDrawData {
  points: number[];
}

export interface EntityData {
  point: Point;
  dimensions: Dimensions;
  entity: Item;
}
