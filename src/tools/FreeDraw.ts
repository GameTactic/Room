import { FreeDrawData, FreeDrawInterface, ToolClass, Tracker } from '@/tools/Tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import FreeDrawCreator from '@/tools/shapes/FreeDrawCreator'
import { CustomEvent } from '@/util/PointerEventMapper'
import throttle from 'lodash.throttle'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export default class FreeDraw extends ToolClass implements FreeDrawInterface {
  private freeDrawCreator: FreeDrawCreator
  private data: FreeDrawData
  private hasMoved = false
  private groupId = uuid()
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean) {
    super()
    this.data = {
      points: []
    }
    this.freeDrawCreator = new FreeDrawCreator(
      this.temporary,
      this.size,
      this.colour,
      this.groupId,
      this.data.points
    )
  }

  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.hasMoved = false
    this.data = {
      points: [event.globalOffset.x, event.globalOffset.y]
    }
    this.groupId = uuid()
    this.freeDrawCreator = new FreeDrawCreator(
      this.temporary,
      this.size,
      this.colour,
      this.groupId,
      this.data.points.map((num: number) => num % 2 ? this.formatX(num) : this.formatY(num))
    )
    this.freeDrawCreator.create()
  }

  mouseMoveAction = throttle((event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.hasMoved) { this.hasMoved = true }
      this.data.points = this.data.points.concat([ event.globalOffset.x, event.globalOffset.y ])
      this.freeDrawCreator.move(this.data.points)
      this.layer.batchDraw()
    }
  }, 10)

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    if (this.enabled) {
      this.disableTool()
      if (this.jti) {
        if (!this.hasMoved) {
          this.freeDrawCreator.destroy()
        } else {
          if (this.temporary) {
            this.freeDrawCreator.runTemporaryAnimation(this.freeDrawCreator.getGroup())
          }
          this.sendAndAddToState({
            id: uuid(),
            jti: this.jti,
            modifyData: {
              additions: [this.groupId],
              tool: AdditionTools.FREEDRAW
            },
            modifyType: Tracker.ADDITION,
            canvasElements: [{
              id: this.groupId,
              tool: this,
              type: CanvasElementType.SHAPE,
              data: this.data,
              jti: this.jti,
              isVisible: true,
              layerId: this.layer.id(),
              attrs: {
                position: {
                  x: this.formatXInverse(this.freeDrawCreator.getGroup().position().x),
                  y: this.formatYInverse(this.freeDrawCreator.getGroup().position().y)
                },
                rotation: this.freeDrawCreator.getGroup().rotation(),
                skewX: this.freeDrawCreator.getGroup().skewX(),
                skewY: this.freeDrawCreator.getGroup().skewY(),
                scaleX: this.freeDrawCreator.getGroup().scaleX(),
                scaleY: this.freeDrawCreator.getGroup().scaleY()
              }
            }],
            timestampModified: ISO.timestamp()
          }, SocketCanvasToolsEmit.CANVAS_TOOLS_FREE_DRAW)
        }
      }
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as FreeDrawData
      if (data.points) {
        this.freeDrawCreator = new FreeDrawCreator(
          canvasElement.tool.temporary,
          canvasElement.tool.size,
          canvasElement.tool.colour,
          canvasElement.id,
          data.points.map((num: number) => num % 2 ? this.formatX(num) : this.formatY(num))
        )
        this.freeDrawCreator.create()
        if (canvasElement.tool.temporary) {
          this.freeDrawCreator.runTemporaryAnimation(this.freeDrawCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
}
