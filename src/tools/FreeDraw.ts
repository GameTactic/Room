import { FreeDrawData, FreeDrawInterface, ToolClass, Tracker } from '@/tools/Tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import FreeDrawCreator from '@/tools/shapes/FreeDrawCreator'
import { CustomEvent } from '@/util/PointerEventMapper'
import throttle from 'lodash.throttle'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'

export default class FreeDraw extends ToolClass implements FreeDrawInterface {
  private freeDrawCreator: FreeDrawCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean) {
    super()
    this.freeDrawCreator = new FreeDrawCreator(
      this.temporary,
      this.size,
      this.colour
    )
  }

  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.resetCanvasEntity()
    this.canvasElement.type = CanvasElementType.SHAPE
    this.canvasElement.isVisible = true
    this.canvasElement.data = { points: [event.globalOffset.x, event.globalOffset.y] }
    this.canvasElement.tool = {
      name: this.name,
      size: this.size,
      colour: this.colour,
      temporary: this.temporary
    }
    this.freeDrawCreator = new FreeDrawCreator(
      this.temporary,
      this.size,
      this.colour
    )
    this.freeDrawCreator.create(event)
    this.canvasElement.position = this.freeDrawCreator.getGroup().getPosition()
  }

  mouseMoveAction = throttle((event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.canvasEntity.hasMoved) { this.canvasEntity.hasMoved = true }
      const data = this.canvasElement.data as FreeDrawData
      data.points = [ ...data.points, event.globalOffset.x, event.globalOffset.y ]
      this.freeDrawCreator.move(event)
      this.layer.batchDraw()
    }
  }, 10)

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    if (this.enabled) {
      this.disableTool()
      if (!this.canvasEntity.hasMoved) {
        this.freeDrawCreator.destroy()
      } else {
        if (this.canvasElement.tool.temporary) {
          this.freeDrawCreator.runTemporaryAnimation(this.freeDrawCreator.getGroup())
        }
        this.sendAndAddToState({
          id: uuid(),
          jti: this.canvasElement.jti,
          modifyData: {
            additions: [this.canvasElement.id],
            tool: AdditionTools.FREEDRAW
          },
          modifyType: Tracker.ADDITION,
          canvasElements: [this.canvasElement],
          timestampModified: ISO.timestamp()
        })
      }
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as FreeDrawData
      if (data.points) {
        this.freeDrawCreator = new FreeDrawCreator(
          canvasElement.tool.temporary || this.temporary,
          canvasElement.tool.size || this.size,
          canvasElement.tool.colour || this.colour
        )
        this.freeDrawCreator.create(this.stageEvent, canvasElement)
        if (canvasElement.tool.temporary) {
          this.freeDrawCreator.runTemporaryAnimation(this.freeDrawCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
}
