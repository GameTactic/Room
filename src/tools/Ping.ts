import { PingData, PingInterface, Tool, Tracker } from '@/tools/Tool'
import { CanvasElement, CanvasElementType, RequestCanvasEntity } from '@/types/Canvas'
import throttle from 'lodash.throttle'
import PingCreator from '@/tools/shapes/PingCreator'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import uuid from 'uuid'

export default class Ping extends Tool implements PingInterface {
  private pingCreator: PingCreator
  constructor (public readonly name: string,
               public readonly size: number,
               public readonly colour: string,
               public readonly temporary: boolean) {
    super()
    this.pingCreator = new PingCreator(
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
    this.canvasElement.data = {
      point: { x: event.globalOffset.x, y: event.globalOffset.y }
    }
    this.canvasElement.tool = {
      name: this.name,
      colour: this.colour,
      size: this.size,
      temporary: this.temporary
    }
    this.triggerPing(event)
    this.canvasElement.position = this.pingCreator.getGroup().getPosition()
  }

  mouseMoveAction = throttle((event: CustomEvent): void => {
    if (this.enabled) {
      this.canvasElement.data = {
        point: { x: event.globalOffset.x, y: event.globalOffset.y }
      }
      this.triggerPing(event)
    }
  }, 75)

  mouseUpAction = (event: CustomEvent): void => {
    if (this.enabled) {
      this.disableTool()
      this.triggerPing(event)
    }
  }

  triggerPing = (event: CustomEvent): void => {
    this.pingCreator.create(event)
    this.send({
      id: uuid(),
      jti: this.canvasElement.jti,
      modifyType: Tracker.ADDITION,
      modifyData: {
        additions: [this.canvasElement.id]
      },
      canvasElements: [this.canvasElement],
      timestampModified: ISO.timestamp()
    })
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    request.canvasElements.forEach((canvasElement: CanvasElement) => {
      const data = canvasElement.data as PingData
      if (data.point) {
        this.pingCreator = new PingCreator(
          canvasElement.tool.temporary || this.temporary,
          canvasElement.tool.size || this.size,
          canvasElement.tool.colour || this.colour
        )
        this.pingCreator.create(this.stageEvent, canvasElement)
      }
    })
  }
}
