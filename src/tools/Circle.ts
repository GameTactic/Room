import { CircleData, CircleInterface, ToolClass, Tracker } from '@/tools/Tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import CircleCreator from '@/tools/shapes/CircleCreator'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export default class Circle extends ToolClass implements CircleInterface {
  private circleCreator: CircleCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean,
               public showRadius: boolean,
               public outlineColour: string,
               public strokeStyle: number) {
    super()
    this.circleCreator = new CircleCreator(
      this.temporary,
      this.size,
      this.colour,
      this.outlineColour,
      this.strokeStyle,
      this.showRadius)
  }

  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.resetCanvasEntity()
    this.canvasElement.isVisible = true
    this.canvasElement.type = CanvasElementType.SHAPE
    this.canvasElement.data = {
      from: {
        x: event.globalOffset.x,
        y: event.globalOffset.y
      },
      to: {
        x: event.globalOffset.x,
        y: event.globalOffset.y
      }
    }
    this.canvasElement.tool = {
      name: this.name,
      size: this.size,
      colour: this.colour,
      showRadius: this.showRadius,
      outlineColour: this.outlineColour,
      strokeStyle: this.strokeStyle,
      temporary: this.temporary
    }
    this.circleCreator = new CircleCreator(
      this.temporary,
      this.size,
      this.colour,
      this.outlineColour,
      this.strokeStyle,
      this.showRadius
    )
    this.circleCreator.create(event)
    this.canvasElement.position = this.circleCreator.getGroup().getPosition()
  }

  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.canvasEntity.hasMoved) { this.canvasEntity.hasMoved = true }
      const data = this.canvasElement.data as CircleData
      data.to = { x: event.globalOffset.x, y: event.globalOffset.y }
      this.circleCreator.move(event)
      this.layer.batchDraw()
    }
  }

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    if (this.enabled) {
      this.disableTool()
      if (!this.canvasEntity.hasMoved) {
        this.circleCreator.destroy()
      } else {
        if (this.canvasElement.tool.temporary) {
          this.circleCreator.runTemporaryAnimation(this.circleCreator.getGroup())
        }
        this.sendAndAddToState({
          id: uuid(),
          jti: this.canvasElement.jti,
          modifyData: {
            additions: [this.canvasElement.id],
            tool: AdditionTools.CIRCLE
          },
          modifyType: Tracker.ADDITION,
          canvasElements: [this.canvasElement],
          timestampModified: ISO.timestamp()
        }, SocketCanvasToolsEmit.CANVAS_TOOLS_CIRCLE)
      }
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as CircleData
      if (data.from && data.to) {
        this.circleCreator = new CircleCreator(
          canvasElement.tool.temporary || this.temporary,
          canvasElement.tool.size || this.size,
          canvasElement.tool.colour || this.colour,
          canvasElement.tool.outlineColour || this.outlineColour,
          canvasElement.tool.strokeStyle || this.strokeStyle,
          canvasElement.tool.showRadius || this.showRadius
        )
        this.circleCreator.create(this.stageEvent, canvasElement)
        this.circleCreator.move(this.stageEvent, canvasElement)
        if (canvasElement.tool.temporary) {
          this.circleCreator.runTemporaryAnimation(this.circleCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
}
