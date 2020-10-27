import { EntityData, ToolClass, Tracker } from '@/tools/tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/canvas'
import { CustomEvent } from '@/util/pointerEventMapper'
import EntityCreator from '@/tools/shapes/entityCreator'
import { v4 as uuid } from 'uuid'
import { ISO } from '@/util/iso'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'
import { Entity as EntityInterface } from '@/store/types'

export default class Entity extends ToolClass {
  private data: EntityData | undefined
  private entityCreator: EntityCreator
  private entity: EntityInterface | undefined
  constructor (public readonly name: string,
               public temporary: boolean,
               public groupId: string = uuid()) {
    super()
    this.entityCreator = new EntityCreator(this.temporary, '', { x: 0, y: 0 }, { width: 0, height: 0 }, '', '', this.groupId)
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
      }
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
          tool: this,
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
