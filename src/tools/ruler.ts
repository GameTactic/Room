import { LineData, RulerData, RulerInterface, ToolClass, Tracker } from '@/tools/tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/canvas'
import RulerCreator from '@/tools/shapes/rulerCreator'
import { CustomEvent } from '@/util/pointerEventMapper'
import { ISO } from '@/util/iso'
import { v4 as uuid } from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export default class Ruler extends ToolClass implements RulerInterface {
  private rulerCreator: RulerCreator
  private hasMoved = false
  private data: RulerData = { from: { x: 0, y: 0 }, to: { x: 0, y: 0 } }
  private groupId = uuid()
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
      this.showCircle,
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
    this.rulerCreator = new RulerCreator(
      this.temporary,
      this.size,
      this.colour,
      this.showCircle,
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
    this.rulerCreator.create()
  }

  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.hasMoved) { this.hasMoved = true }
      this.data.to = { x: event.globalOffset.x, y: event.globalOffset.y }
      this.rulerCreator.move(this.data.from, this.data.to)
      this.layer.batchDraw()
    }
  }

  mouseUpAction = (): void => {
    if (this.enabled) {
      this.disableTool()
      if (!this.hasMoved) {
        this.rulerCreator.destroy()
      } else {
        if (this.temporary) {
          this.rulerCreator.runTemporaryAnimation(this.rulerCreator.getGroup())
        }
        if (this.jti) {
          this.sendAndAddToState({
            id: uuid(),
            jti: this.jti,
            modifyData: {
              additions: [this.groupId],
              tool: AdditionTools.RULER
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
                  x: this.formatXInverse(this.rulerCreator.getGroup().position().x),
                  y: this.formatYInverse(this.rulerCreator.getGroup().position().y)
                },
                rotation: this.rulerCreator.getGroup().rotation(),
                skewX: this.rulerCreator.getGroup().skewX(),
                skewY: this.rulerCreator.getGroup().skewY(),
                scaleX: this.rulerCreator.getGroup().scaleX(),
                scaleY: this.rulerCreator.getGroup().scaleY()
              }
            }],
            timestampModified: ISO.timestamp()
          }, SocketCanvasToolsEmit.CANVAS_TOOLS_RULER)
        }
      }
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as LineData
      if (data.from && data.to) {
        const tool = canvasElement.tool as RulerInterface
        this.rulerCreator = new RulerCreator(
          tool.temporary,
          tool.size,
          tool.colour,
          tool.showCircle,
          canvasElement.id,
          {
            x: this.formatX(data.from.x),
            y: this.formatX(data.from.y)
          },
          {
            x: this.formatX(data.to.x),
            y: this.formatX(data.to.y)
          }
        )
        this.rulerCreator.create()
        if (canvasElement.tool.temporary) {
          this.rulerCreator.runTemporaryAnimation(this.rulerCreator.getGroup())
        } else {
          this.layer.batchDraw()
        }
      }
    })
  }
}
