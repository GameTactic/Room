import { LineData, RulerInterface, ToolClass, Tracker } from '@/tools/Tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import RulerCreator from '@/tools/shapes/RulerCreator'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export default class Ruler extends ToolClass implements RulerInterface {
  private rulerCreator: RulerCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean,
               public showCircle: boolean) {
    super()
    this.rulerCreator = new RulerCreator(
      this.temporary,
      this.size,
      this.colour,
      this.showCircle
    )
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
      temporary: this.temporary,
      showCircle: this.showCircle
    }
    this.rulerCreator = new RulerCreator(
      this.temporary,
      this.size,
      this.colour,
      this.showCircle
    )
    this.rulerCreator.create(event)
    this.canvasElement.attrs.position = this.rulerCreator.getGroup().getPosition()
  }

  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.canvasEntity.hasMoved) { this.canvasEntity.hasMoved = true }
      const data = this.canvasElement.data as LineData
      data.to = { x: event.globalOffset.x, y: event.globalOffset.y }
      this.rulerCreator.move(event)
      this.layer.batchDraw()
    }
  }

  mouseUpAction = (): void => {
    if (this.enabled) {
      this.disableTool()
      if (!this.canvasEntity.hasMoved) {
        this.rulerCreator.destroy()
      } else {
        if (this.canvasElement.tool.temporary) {
          this.rulerCreator.runTemporaryAnimation(this.rulerCreator.getGroup())
        }
        this.sendAndAddToState({
          id: uuid(),
          jti: this.canvasElement.jti,
          modifyData: {
            additions: [this.canvasElement.id],
            tool: AdditionTools.RULER
          },
          modifyType: Tracker.ADDITION,
          canvasElements: [this.canvasElement],
          timestampModified: ISO.timestamp()
        }, SocketCanvasToolsEmit.CANVAS_TOOLS_RULER)
      }
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as LineData
      if (data.from && data.to) {
        this.rulerCreator = new RulerCreator(
          canvasElement.tool.temporary || this.temporary,
          canvasElement.tool.size || this.size,
          canvasElement.tool.colour || this.colour,
          canvasElement.tool.showCircle || this.showCircle
        )
        this.rulerCreator.create(this.stageEvent, canvasElement)
        this.rulerCreator.move(this.stageEvent, canvasElement)
        if (canvasElement.tool.temporary) {
          this.rulerCreator.runTemporaryAnimation(this.rulerCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
}
