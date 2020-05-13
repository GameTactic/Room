import { LineData, LineInterface, ToolClass, Tracker } from '@/tools/Tool'
import LineCreator from '@/tools/shapes/LineCreator'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export default class Line extends ToolClass implements LineInterface {
  private lineCreator: LineCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public endStyle: string,
               public strokeStyle: number,
               public temporary: boolean) {
    super()
    this.lineCreator = new LineCreator(
      this.temporary,
      this.size,
      this.colour,
      this.strokeStyle
    )
  }

  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.resetCanvasEntity()
    this.canvasElement.type = CanvasElementType.SHAPE
    this.canvasElement.isVisible = true
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
      colour: this.colour,
      size: this.size,
      endStyle: this.endStyle,
      strokeStyle: this.strokeStyle,
      temporary: this.temporary
    }
    this.lineCreator = new LineCreator(
      this.temporary,
      this.size,
      this.colour,
      this.strokeStyle
    )
    this.lineCreator[`create${this.endStyle.toUpperCase()}`](event)
    this.canvasElement.position = this.lineCreator.getGroup().getPosition()
  }

  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.canvasEntity.hasMoved) { this.canvasEntity.hasMoved = true }
      const data = this.canvasElement.data as LineData
      data.to = { x: event.globalOffset.x, y: event.globalOffset.y }
      this.lineCreator['move' + this.endStyle.toUpperCase()](event)
      this.layer.batchDraw()
    }
  }

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    if (this.enabled) {
      this.disableTool()
      if (!this.canvasEntity.hasMoved) {
        this.lineCreator.destroy()
      } else {
        if (this.canvasElement.tool.temporary) {
          this.lineCreator.runTemporaryAnimation(this.lineCreator.getGroup())
        }
        this.sendAndAddToState({
          id: uuid(),
          jti: this.canvasElement.jti,
          modifyType: Tracker.ADDITION,
          modifyData: {
            additions: [this.canvasElement.id],
            tool: AdditionTools.LINE
          },
          canvasElements: [this.canvasElement],
          timestampModified: ISO.timestamp()
        }, SocketCanvasToolsEmit.CANVAS_TOOLS_LINE)
      }
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as LineData
      if (data.from && data.to) {
        this.lineCreator = new LineCreator(
          canvasElement.tool.temporary || this.temporary,
          canvasElement.tool.size || this.size,
          canvasElement.tool.colour || this.colour,
          canvasElement.tool.strokeStyle || this.strokeStyle
        )
        this.lineCreator['create' + canvasElement.tool.endStyle?.toUpperCase()](this.stageEvent, canvasElement)
        if (canvasElement.tool.temporary) {
          this.lineCreator.runTemporaryAnimation(this.lineCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
}
