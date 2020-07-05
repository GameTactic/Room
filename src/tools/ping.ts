import { PingData, PingInterface, ToolClass, Tracker } from '@/tools/tool'
import { AdditionTools, CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/canvas'
import throttle from 'lodash.throttle'
import PingCreator from '@/tools/shapes/pingCreator'
import { CustomEvent } from '@/util/pointerEventMapper'
import { ISO } from '@/util/iso'
import uuid from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export default class Ping extends ToolClass implements PingInterface {
  private data: PingData = { point: { x: 0, y: 0 } }
  private groupId = uuid()
  private pingCreator: PingCreator
  constructor (public readonly name: string,
               public readonly size: number,
               public readonly colour: string,
               public readonly temporary: boolean) {
    super()
    this.pingCreator = new PingCreator(
      this.temporary,
      this.size,
      this.colour,
      this.groupId,
      this.data.point
    )
  }

  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.data = {
      point: { x: event.globalOffset.x, y: event.globalOffset.y }
    }
    this.triggerPing()
  }

  mouseMoveAction = throttle((event: CustomEvent): void => {
    if (this.enabled) {
      this.data = {
        point: { x: event.globalOffset.x, y: event.globalOffset.y }
      }
      this.triggerPing()
    }
  }, 75)

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    if (this.enabled) {
      this.disableTool()
    }
  }

  triggerPing = (): void => {
    if (this.jti) {
      this.pingCreator = new PingCreator(
        this.temporary,
        this.size,
        this.colour,
        this.groupId,
        this.data.point
      )
      this.pingCreator.create()
      this.send({
        id: uuid(),
        jti: this.jti,
        modifyType: Tracker.ADDITION,
        modifyData: {
          additions: [this.groupId],
          tool: AdditionTools.PING
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
              x: this.formatXInverse(this.pingCreator.getGroup().position().x),
              y: this.formatYInverse(this.pingCreator.getGroup().position().y)
            },
            rotation: this.pingCreator.getGroup().rotation(),
            skewX: this.pingCreator.getGroup().skewX(),
            skewY: this.pingCreator.getGroup().skewY(),
            scaleX: this.pingCreator.getGroup().scaleX(),
            scaleY: this.pingCreator.getGroup().scaleY()
          }
        }],
        timestampModified: ISO.timestamp()
      }, SocketCanvasToolsEmit.CANVAS_TOOLS_PING)
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as PingData
      if (data.point) {
        const tool = canvasElement.tool as PingInterface
        this.pingCreator = new PingCreator(
          tool.temporary,
          tool.size,
          tool.colour,
          canvasElement.id,
          {
            x: this.formatX(data.point.x),
            y: this.formatY(data.point.y)
          }
        )
        this.pingCreator.create()
      }
    })
  }
}
