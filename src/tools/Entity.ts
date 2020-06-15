import { EntityData, ToolClass, Tracker } from '@/tools/Tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import { CustomEvent } from '@/util/PointerEventMapper'
import { Item } from '@/types/Games/Index'
import EntityCreator from '@/tools/shapes/EntityCreator'
import uuid from 'uuid'
import { ISO } from '@/util/ISO'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export default class Entity extends ToolClass {
  private entityCreator: EntityCreator
  constructor (public readonly name: string,
               public temporary: boolean) {
    super()
    this.entityCreator = new EntityCreator(this.temporary)
  }
  // eslint-disable-next-line
  mouseDownAction = (event: CustomEvent): void => {
  }
  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent): void => {
  }
  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as EntityData
      if (data.point && data.dimensions && data.entity) {
        this.entityCreator = new EntityCreator(
          canvasElement.tool.temporary || this.temporary
        )
        this.entityCreator.create(this.stageEvent, canvasElement)
        if (canvasElement.tool.temporary) {
          this.entityCreator.runTemporaryAnimation(this.entityCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
  entityToRequest = (entity: Item, event: CustomEvent): RequestCanvasEntity => {
    this.resetCanvasEntity()
    this.canvasElement.isVisible = true
    this.canvasElement.type = CanvasElementType.ENTITY
    this.canvasElement.data = {
      point: {
        x: event.globalOffset.x,
        y: event.globalOffset.y
      },
      dimensions: {
        width: 35, // Hardcoded for now
        height: 35 // Hardcoded for now
      },
      entity: entity
    } as EntityData
    this.canvasElement.tool = {
      name: this.name,
      temporary: this.temporary
    }
    this.canvasElement.attrs.position = { x: 0, y: 0 }
    const request: RequestCanvasEntity = {
      id: uuid(),
      jti: this.canvasElement.jti,
      modifyData: {
        additions: [this.canvasElement.id],
        tool: AdditionTools.ENTITY
      },
      modifyType: Tracker.ADDITION,
      canvasElements: [this.canvasElement],
      timestampModified: ISO.timestamp()
    }
    this.sendAndAddToState(request, SocketCanvasToolsEmit.CANVAS_TOOLS_ENTITY)
    return request
  }
}
