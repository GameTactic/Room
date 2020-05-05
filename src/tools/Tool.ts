import Konva from 'konva'
import {
  AdditionData,
  CanvasElement,
  MoveData,
  RemovalData,
  RequestCanvasEntity,
  VueKonvaStage
} from '@/types/Canvas'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'
import store from '@/main'
import { SocketActions } from '@/store/modules/socket'
import { StageGetters } from '@/store/modules/stage'
import { Point } from 'konva/types/Util'
import { CanvasEntityActions, CanvasEntityGetters, CanvasEntityState } from '@/store/modules/canvasEntity'
import { LayerGetters } from '@/store/modules/layer'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'
import { CanvasAction, CanvasGetters } from '@/store/modules/canvas'

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

export class Tool {
  get enabled (): boolean {
    return store.getters[`tools/${ToolGetters.ENABLED}`]
  }

  disableTool = (): void => {
    store.dispatch(`tools/${ToolsAction.DISABLE}`)
  }

  enableTool = (): void => {
    store.dispatch(`tools/${ToolsAction.ENABLE}`)
  }

  sendAndAddToState = (request: RequestCanvasEntity): void => {
    this.send(request)
    this.addToState(request)
  }

  addToState = (request: RequestCanvasEntity): void => {
    switch (request.modifyType) {
      case Tracker.ADDITION :
        const additionsData = request.modifyData as AdditionData
        if (request.canvasElements.length === additionsData.additions.length && request.canvasElements.length > 0) {
          store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, {
            jti: request.jti,
            id: request.id,
            modifyType: request.modifyType,
            modifyData: request.modifyData,
            timestampModified: request.timestampModified
          })
          request.canvasElements.forEach((canvasElement: CanvasElement) => {
            store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT}`, canvasElement)
          })
        }
        break
      case Tracker.REMOVAL:
        const removalsData = request.modifyData as RemovalData
        if (removalsData.removals && removalsData.removals.length > 0) {
          const canvasElements = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`]
          if (canvasElements) {
            removalsData.removals.forEach((groupId: string) => {
              const foundElement: CanvasElement = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
              if (foundElement) {
                store.dispatch(`canvas/${CanvasAction.HIDE_CANVAS_ELEMENT}`, foundElement)
              }
            })
            store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, {
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
          const canvasElements = store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`]
          if (canvasElements) {
            moveData.groups.forEach((groupId: string) => {
              const foundElement: CanvasElement = canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === groupId)
              if (foundElement) {
                foundElement.position = {
                  x: (moveData.to.x - moveData.from.x) + foundElement.position.x,
                  y: (moveData.to.y - moveData.from.y) + foundElement.position.y
                }
              }
            })
            store.dispatch(`canvas/${CanvasAction.ADD_CANVAS_ELEMENT_HISTORY}`, {
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

  send = (request: RequestCanvasEntity): void => {
    store.dispatch(`socket/${SocketActions.SEND_IF_OPEN}`, request)
  }

  get stageEvent (): CustomStageEvent {
    return {
      stage: store.getters?.[`stage/${StageGetters.STAGE}`],
      stageConfig: store.getters?.[`stage/${StageGetters.STAGE_CONFIG}`],
      zoom: store.getters?.[`stage/${StageGetters.STAGE_ZOOM}`]
    }
  }

  resetCanvasEntity = (): CanvasEntityState => {
    store.dispatch(`canvasEntity/${CanvasEntityActions.RESET_CANVAS_ENTITY}`)
    const canvasEntity: CanvasEntityState = store.getters[`canvasEntity/${CanvasEntityGetters.CANVAS_ENTITY}`]
    canvasEntity.hasMoved = false
    return canvasEntity
  }

  get canvasElement (): CanvasElement {
    return store.getters[`canvasEntity/${CanvasEntityGetters.CANVAS_ELEMENT}`]
  }

  set canvasElement (canvasElement: CanvasElement) {
    store.dispatch(`canvasEntity/${CanvasEntityActions.SET_CANVAS_ELEMENT}`, canvasElement)
  }

  get canvasEntity (): CanvasEntityState {
    return store.getters[`canvasEntity/${CanvasEntityGetters.CANVAS_ENTITY}`]
  }

  set canvasEntity (canvasEntity: CanvasEntityState) {
    store.dispatch(`canvasEntity/${CanvasEntityActions.SET_CANVAS_ENTITY}`, canvasEntity)
  }

  get layer (): Konva.Layer {
    return store.getters[`layer/${LayerGetters.LAYER}`]
  }

  get canvasElements (): CanvasElement[] {
    return store.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`]
  }
}

export interface ToolInterface {
  name: string;
  temporary: boolean;
  // eslint-disable-next-line
  [key: string]: any
}

export interface CanvasToolInterface extends ToolInterface {
  canvasDownAction: CanvasDownAction;
  canvasMoveAction: CanvasMoveAction;
  canvasUpAction: CanvasUpAction;
}

export interface ToolClassInterface extends ToolInterface {
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
