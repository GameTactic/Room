import { EntityData, ToolClass, Tracker } from '@/tools/Tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import { CustomEvent } from '@/util/PointerEventMapper'
import EntityCreator from '@/tools/shapes/EntityCreator'
import uuid from 'uuid'
import { ISO } from '@/util/ISO'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'
import store from '@/main'
import { Namespaces } from '@/store'
import { SocketTeamGetters } from '@/store/modules/socket/team'
import { Team, Entity as EntityInterface } from '@/store/types'

export default class Entity extends ToolClass {
  private entityCreator: EntityCreator
  private entity: EntityInterface | undefined
  private currentTeam: Team | undefined
  constructor (public readonly name: string,
               public temporary: boolean) {
    super()
    this.entityCreator = new EntityCreator(this.temporary)
  }
  // eslint-disable-next-line
  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.currentTeam = store.getters[`${Namespaces.SOCKET_TEAM}/${SocketTeamGetters.SELECTED_TEAM}`]
    if (this.entity && this.currentTeam) {
      this.resetCanvasEntity()
      this.canvasElement.isVisible = true
      this.canvasElement.type = CanvasElementType.ENTITY
      this.canvasElement.data = {
        point: {
          x: event.globalOffset.x,
          y: event.globalOffset.y
        },
        dimensions: {
          width: 35,
          height: 35
        },
        image: this.entity.image,
        name: this.entity.name,
        id: this.entity.id,
        team: this.currentTeam
      } as EntityData
      this.canvasElement.tool = {
        name: this.name,
        temporary: this.temporary
      }
      this.entityCreator = new EntityCreator(this.temporary)
    }
  }
  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent): void => {
  }
  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    this.disableTool()
    if (this.entity && this.currentTeam) {
      this.entityCreator.create(event, this.canvasElement)
      this.canvasElement.attrs.position = this.entityCreator.getGroup().getPosition()
      if (this.canvasElement.tool.temporary) {
        this.entityCreator.runTemporaryAnimation(this.entityCreator.getGroup())
      }
      this.sendAndAddToState({
        id: uuid(),
        jti: this.canvasElement.jti,
        modifyData: {
          additions: [this.canvasElement.id],
          tool: AdditionTools.ENTITY
        },
        modifyType: Tracker.ADDITION,
        canvasElements: [this.canvasElement],
        timestampModified: ISO.timestamp()
      }, SocketCanvasToolsEmit.CANVAS_TOOLS_ENTITY)
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as EntityData
      if (data.point && data.dimensions && data.image && data.name && data.id) {
        this.entityCreator = new EntityCreator(canvasElement.tool.temporary || this.temporary)
        this.entityCreator.create(this.stageEvent, canvasElement)
        if (canvasElement.tool.temporary) {
          this.entityCreator.runTemporaryAnimation(this.entityCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }

  setEntity = (entity: EntityInterface): void => {
    this.entity = entity
  }
}
