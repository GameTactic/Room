import { EntityData, ToolClass, ToolClassInterface, Tracker } from '@/tools/Tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import { CustomEvent } from '@/util/PointerEventMapper'
import EntityCreator from '@/tools/shapes/EntityCreator'
import uuid from 'uuid'
import { ISO } from '@/util/ISO'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'
import { Entity as EntityInterface } from '@/store/types'

export default class Entity extends ToolClass {
  private data: EntityData | undefined
  private entityCreator: EntityCreator
  private entity: EntityInterface | undefined
  private groupId = uuid()
  constructor (public readonly name: string,
               public temporary: boolean) {
    super()
    this.entityCreator = new EntityCreator(
      this.temporary,
      '',
      { x: 0, y: 0 },
      { width: 0, height: 0 },
      '',
      this.groupId
    )
  }
  // eslint-disable-next-line
  mouseDownAction = (event: CustomEvent): void => {
  }
  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent): void => {
  }
  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    if (this.entity && this.currentTeam && this.jti) {
      this.groupId = uuid()
      this.data = {
        point: {
          x: event.globalOffset.x,
          y: event.globalOffset.y
        },
        dimensions: this.entity.canvasImage.dimensions,
        image: this.entity.canvasImage.image,
        name: this.entity.name,
        id: this.entity.id,
        team: this.currentTeam
      } as EntityData
      this.entityCreator = new EntityCreator(
        this.temporary,
        this.data.image,
        {
          x: this.formatX(this.data.point.x),
          y: this.formatY(this.data.point.y)
        },
        {
          width: this.formatX(this.data.dimensions.width),
          height: this.formatY(this.data.dimensions.height)
        },
        this.data.name,
        this.groupId,
        this.data.team.color
      )
      this.entityCreator.create()
      if (this.temporary) {
        this.entityCreator.runTemporaryAnimation(this.entityCreator.getGroup())
      }
      this.sendAndAddToState({
        id: uuid(),
        jti: this.jti,
        modifyData: {
          additions: [this.groupId],
          tool: AdditionTools.ENTITY
        },
        modifyType: Tracker.ADDITION,
        canvasElements: [{
          id: this.groupId,
          tool: {
            name: this.name,
            temporary: this.temporary
          } as ToolClassInterface,
          type: CanvasElementType.ENTITY,
          data: this.data,
          jti: this.jti,
          isVisible: true,
          layerId: this.layer.id(),
          attrs: {
            position: {
              x: this.formatXInverse(this.entityCreator.getGroup().position().x),
              y: this.formatYInverse(this.entityCreator.getGroup().position().y)
            },
            rotation: this.entityCreator.getGroup().rotation(),
            skewX: this.entityCreator.getGroup().skewX(),
            skewY: this.entityCreator.getGroup().skewY(),
            scaleX: this.entityCreator.getGroup().scaleX(),
            scaleY: this.entityCreator.getGroup().scaleY()
          }
        }],
        timestampModified: ISO.timestamp()
      }, SocketCanvasToolsEmit.CANVAS_TOOLS_ENTITY)
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as EntityData
      if (data.point && data.dimensions && data.image && data.name && data.id) {
        this.entityCreator = new EntityCreator(
          canvasElement.tool.temporary,
          data.image,
          {
            x: this.formatX(data.point.x),
            y: this.formatY(data.point.y)
          },
          {
            width: this.formatX(data.dimensions.width),
            height: this.formatY(data.dimensions.height)
          },
          data.name,
          canvasElement.id,
          data.team.color
        )
        this.entityCreator.create()
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

  getEntity = (): EntityInterface | undefined => {
    return this.entity
  }
}
