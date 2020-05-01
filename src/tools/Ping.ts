import { PingInterface, Tool, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import throttle from 'lodash.throttle'
import uuid from 'uuid'
import PingCreator from '@/tools/shapes/PingCreator'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

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

  mouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.triggerPing(event, canvasElement, layer)
  }

  mouseMoveAction = throttle((event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.triggerPing(event, canvasElement, layer)
  }, 75)

  mouseUpAction = (): void => {
    // mouse up action
  }

  triggerPing = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
    canvasElement.id = uuid()
    canvasElement.hasMoved = true
    canvasElement.change = false
    canvasElement.tracker = Tracker.ADDITION
    canvasElement.tool = {
      name: this.name,
      colour: this.colour,
      size: this.size,
      temporary: this.temporary
    }
    this.pingCreator.create(canvasElement, layer, event)
    canvasElement.position = this.pingCreator.getGroup().position()
    this.send(canvasElement)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    this.pingCreator = new PingCreator(
      canvasElement.tool.temporary || this.temporary,
      canvasElement.tool.size || this.size,
      canvasElement.tool.colour || this.colour
    )
    this.pingCreator.create(canvasElement, layer, event)
  }
}
