import { CircleData, CircleInterface, ToolClass, Tracker } from '@/tools/Tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import CircleCreator from '@/tools/shapes/CircleCreator'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export default class Circle extends ToolClass implements CircleInterface {
  private circleCreator: CircleCreator
  private groupId = uuid()
  private data: CircleData = {
    from: { x: 0, y: 0 },
    to: { x: 0, y: 0 }
  }
  private hasMoved = false
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
      this.showRadius,
      this.groupId,
      this.data.from,
      this.data.to
    )
  }

  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.hasMoved = false
    this.groupId = uuid()
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
    this.circleCreator = new CircleCreator(
      this.temporary,
      this.size,
      this.colour,
      this.outlineColour,
      this.strokeStyle,
      this.showRadius,
      this.groupId,
      {
        x: this.formatX(this.data.from.x),
        y: this.formatY(this.data.from.y)
      },
      {
        x: this.formatX(this.data.to.x),
        y: this.formatY(this.data.to.y)
      }
    )
    this.circleCreator.create()
  }

  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.hasMoved) { this.hasMoved = true }
      this.data.to = { x: event.globalOffset.x, y: event.globalOffset.y }
      this.circleCreator.move(
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
        this.circleCreator.destroy()
      } else {
        if (this.temporary) {
          this.circleCreator.runTemporaryAnimation(this.circleCreator.getGroup())
        }
        if (this.jti) {
          this.sendAndAddToState({
            id: uuid(),
            jti: this.jti,
            modifyData: {
              additions: [this.groupId],
              tool: AdditionTools.CIRCLE
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
                  x: this.formatXInverse(this.circleCreator.getGroup().position().x),
                  y: this.formatYInverse(this.circleCreator.getGroup().position().y)
                },
                rotation: this.circleCreator.getGroup().rotation(),
                skewX: this.circleCreator.getGroup().skewX(),
                skewY: this.circleCreator.getGroup().skewY(),
                scaleX: this.circleCreator.getGroup().scaleX(),
                scaleY: this.circleCreator.getGroup().scaleY()
              }
            }],
            timestampModified: ISO.timestamp()
          }, SocketCanvasToolsEmit.CANVAS_TOOLS_CIRCLE)
        }
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
          canvasElement.tool.showRadius || this.showRadius,
          canvasElement.id,
          {
            x: this.formatX(data.from.x),
            y: this.formatY(data.from.y)
          },
          {
            x: this.formatX(data.to.x),
            y: this.formatY(data.to.y)
          }
        )
        this.circleCreator.create()
        if (canvasElement.tool.temporary) {
          this.circleCreator.runTemporaryAnimation(this.circleCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
}
