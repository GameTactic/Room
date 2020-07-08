import Konva from 'konva'
import {
  AdditionData,
  AdditionTools,
  CanvasElement,
  Point,
  RemovalData,
  RequestCanvasEntity,
  VueKonvaStage
} from '@/types/canvas'
import { CustomEvent, CustomStageEvent } from '@/util/pointerEventMapper'
import store from '@/main'
import { SocketActions } from '@/store/modules/socket'
import { SocketStageGetters } from '@/store/modules/socket/stage'
import { AppStageGetters } from '@/store/modules/app/stage'
import { AppLayerGetters } from '@/store/modules/app/layer'
import { AppToolGetters, AppToolsAction } from '@/store/modules/app/tools'
import { SocketCanvasAction, SocketCanvasGetters } from '@/store/modules/socket/canvas'
import { Dimensions } from '@/mixins/stageWatcher'
import { Namespaces } from '@/store'
import { Api, Entity, Game, Team } from '@/store/types'
import { SocketTeamAction, SocketTeamGetters } from '@/store/modules/socket/team'
import { AppAuthenticationGetters } from '@/store/modules/app/authentication'
import { LineType } from '@/tools/line'
import { AppRoomGetters } from '@/store/modules/app/room'
import { GameApiRoutes } from '@/games/utils'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import { EntitiesDataApi } from '@/types/games/wows'
import { v4 as uuid } from 'uuid'

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
  TRANSFORM = 'transform'
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
      case Tracker.ADDITION: // eslint-disable-next-line no-case-declarations
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
          if (additionsData.tool === AdditionTools.ENTITY) {
            request.canvasElements.forEach((canvasElement: CanvasElement) => {
              if (canvasElement.tool.name === AdditionTools.ENTITY) {
                const api: Api[] = store.getters[`${Namespaces.APP_ROOM}/${AppRoomGetters.API}`]
                const currentGame: Game = store.getters[`${Namespaces.SOCKET_ROOM}/${SocketRoomGetters.GAME}`]
                const apiData: Api | undefined = api.find((api: Api) => currentGame !== Game.NONE && api.name === GameApiRoutes[currentGame].entities)
                if (apiData) {
                  const data = canvasElement.data as EntityData
                  const entities: Entity[] = (apiData.data as EntitiesDataApi).entities
                  if (entities) {
                    const entity = entities.find((entity: Entity) => entity.id === data.id)
                    if (data.team && data.id && entity) {
                      store.dispatch(`${Namespaces.SOCKET_TEAM}/${SocketTeamAction.ADD_ENTITY_TO_TEAM}`, { teamId: data.team.id, entity: { ...entity, id: uuid(), teamId: data.team.id } })
                    }
                  }
                }
              }
            })
          }
        }
        break
      case Tracker.REMOVAL: // eslint-disable-next-line no-case-declarations
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

  get jti (): string | undefined {
    return (store.getters[`${Namespaces.APP_AUTHENTICATION}/${AppAuthenticationGetters.JWT}`]).jti || undefined
  }

  get currentTeam (): Team | undefined {
    return store.getters[`${Namespaces.SOCKET_TEAM}/${SocketTeamGetters.SELECTED_TEAM}`]
  }

  get layer (): Konva.Layer {
    return store.getters[`${Namespaces.APP_LAYER}/${AppLayerGetters.LAYER}`]
  }

  // Transform a global x position to local x position
  formatX = (num: number): number => {
    const stage = store.getters[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`]
    const stageConfig = store.getters[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`]
    return ((num / stageConfig.width) * stage.width())
  }

  // Transform a global y position to local y position
  formatY = (num: number): number => {
    const stage = store.getters[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`]
    const stageConfig = store.getters[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`]
    return ((num / stageConfig.height) * stage.height())
  }

  // Transform a local x position to global x position
  formatXInverse = (num: number): number => {
    const stage = store.getters[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`]
    const stageConfig = store.getters[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`]
    return ((num / stage.width()) * stageConfig.width)
  }

  // Transform a local x position to global x position
  formatYInverse = (num: number): number => {
    const stage = store.getters[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`]
    const stageConfig = store.getters[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`]
    return ((num / stage.height()) * stageConfig.height)
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
  renderCanvas?: RenderCanvas;
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
  endStyle: LineType;
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
  id: string;
  point: Point;
  dimensions: Dimensions;
  name: string;
  image: string;
  team: Team;
}
