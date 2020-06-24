import { LineData, LineInterface, ToolClass, Tracker } from '@/tools/Tool'
import LineCreator from '@/tools/shapes/LineCreator'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export enum LineType {
  LINE = 'line',
  ARROW = 'arrow',
  T_BAR = 'tBar'
}

export default class Line extends ToolClass implements LineInterface {
  private lineCreator: LineCreator
  private groupId = uuid()
  private hasMoved = false
  private data: LineData | undefined
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public endStyle: LineType,
               public strokeStyle: number,
               public temporary: boolean) {
    super()
    this.lineCreator = new LineCreator(
      this.temporary,
      this.size,
      this.colour,
      this.strokeStyle,
      this.groupId,
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      this.endStyle
    )
  }

  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.groupId = uuid()
    this.hasMoved = false
    this.data = {
      from: {
        x: event.globalOffset.x,
        y: event.globalOffset.y
      },
      to: {
        x: event.globalOffset.x,
        y: event.globalOffset.y
      }
    }
    this.lineCreator = new LineCreator(
      this.temporary,
      this.size,
      this.colour,
      this.strokeStyle,
      this.groupId,
      {
        x: this.formatX(this.data.from.x),
        y: this.formatX(this.data.from.y)
      },
      {
        x: this.formatX(this.data.to.x),
        y: this.formatX(this.data.to.y)
      },
      this.endStyle
    )
    this.lineCreator.create()
  }

  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled && this.data) {
      if (!this.hasMoved) { this.hasMoved = true }
      this.data.to = { x: event.globalOffset.x, y: event.globalOffset.y }
      this.lineCreator.move(
        {
          x: this.formatX(this.data.from.x),
          y: this.formatY(this.data.from.y)
        },
        {
          x: this.formatX(this.data.to.x),
          y: this.formatY(this.data.to.y)
        }
      )
      this.layer.batchDraw()
    }
  }

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    if (this.enabled) {
      this.disableTool()
      if (!this.hasMoved) {
        this.lineCreator.destroy()
      } else {
        if (this.temporary) {
          this.lineCreator.runTemporaryAnimation(this.lineCreator.getGroup())
        }
        if (this.jti && this.data) {
          this.sendAndAddToState({
            id: uuid(),
            jti: this.jti,
            modifyType: Tracker.ADDITION,
            modifyData: {
              additions: [this.groupId],
              tool: AdditionTools.LINE
            },
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
                  x: this.formatXInverse(this.lineCreator.getGroup().position().x),
                  y: this.formatYInverse(this.lineCreator.getGroup().position().y)
                },
                rotation: this.lineCreator.getGroup().rotation(),
                skewX: this.lineCreator.getGroup().skewX(),
                skewY: this.lineCreator.getGroup().skewY(),
                scaleX: this.lineCreator.getGroup().scaleX(),
                scaleY: this.lineCreator.getGroup().scaleY()
              }
            }],
            timestampModified: ISO.timestamp()
          }, SocketCanvasToolsEmit.CANVAS_TOOLS_LINE)
        }
      }
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as LineData
      if (data.from && data.to) {
        const tool = canvasElement.tool as LineInterface
        this.lineCreator = new LineCreator(
          tool.temporary,
          tool.size,
          tool.colour,
          tool.strokeStyle,
          tool.id,
          data.from,
          data.to,
          tool.endStyle
        )
        this.lineCreator.create()
        if (canvasElement.tool.temporary) {
          this.lineCreator.runTemporaryAnimation(this.lineCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
}
