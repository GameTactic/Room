import { FreeDrawInterface, Tool, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import FreeDrawCreator from '@/tools/shapes/FreeDrawCreator'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class FreeDraw extends Tool implements FreeDrawInterface {
  private freeDrawCreator: FreeDrawCreator
  constructor (public readonly name: string,
               public size: number,
               public colour: string,
               public temporary: boolean) {
    super()
    this.freeDrawCreator = new FreeDrawCreator(
      this.temporary,
      this.size,
      this.colour
    )
  }

  mouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
    canvasElement.id = uuid()
    canvasElement.hasMoved = false
    canvasElement.change = false
    canvasElement.tracker = Tracker.ADDITION
    canvasElement.tool = {
      name: this.name,
      size: this.size,
      colour: this.colour,
      temporary: this.temporary
    }
    this.freeDrawCreator = new FreeDrawCreator(
      this.temporary,
      this.size,
      this.colour
    )
    this.freeDrawCreator.create(canvasElement, layer, event)
    canvasElement.position = this.freeDrawCreator.getGroup().position()
  }

  mouseMoveAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (!canvasElement.hasMoved) { canvasElement.hasMoved = true }
    canvasElement.data = canvasElement.data.concat([event.globalOffset.x, event.globalOffset.y])
    this.freeDrawCreator.move(canvasElement, layer, event)
    layer.batchDraw()
  }

  mouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (!canvasElement.hasMoved) {
      this.freeDrawCreator.destroy(canvasElement, layer)
    } else {
      if (canvasElement.tool.temporary) {
        this.freeDrawCreator.runTemporaryAnimation(this.freeDrawCreator.getGroup(), layer)
      }
      this.send(canvasElement)
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    if (canvasElement.hasMoved) {
      this.freeDrawCreator = new FreeDrawCreator(
        canvasElement.tool.temporary || this.temporary,
        canvasElement.tool.size || this.size,
        canvasElement.tool.colour || this.colour
      )
      this.freeDrawCreator.create(canvasElement, layer, event)
      layer.batchDraw()
      if (canvasElement.tool.temporary) {
        this.freeDrawCreator.runTemporaryAnimation(this.freeDrawCreator.getGroup(), layer)
      }
    }
  }
}
