import { CircleInterface, Tool, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import CircleCreator from '@/tools/shapes/CircleCreator'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class Circle extends Tool implements CircleInterface {
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
    this.circleCreator.create(canvasElement, layer, event)
    canvasElement.position = this.circleCreator.getGroup().position()
  }

  mouseMoveAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (!canvasElement.hasMoved) { canvasElement.hasMoved = true }
    const pos = { x: event.globalOffset.x, y: event.globalOffset.y }
    this.circleCreator.move(canvasElement, layer, pos, event)
    layer.batchDraw()
  }

  mouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (!canvasElement.hasMoved) {
      this.circleCreator.destroy(canvasElement, layer)
    } else {
      if (canvasElement.tool.temporary) {
        this.circleCreator.runTemporaryAnimation(this.circleCreator.getGroup(), layer)
      }
      canvasElement.data = canvasElement.data.concat([event.globalOffset.x, event.globalOffset.y])
      this.send(canvasElement)
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomStageEvent): void => {
    if (canvasElement.hasMoved) {
      this.circleCreator = new CircleCreator(
        canvasElement.tool.temporary || this.temporary,
        canvasElement.tool.size || this.size,
        canvasElement.tool.colour || this.colour,
        canvasElement.tool.outlineColour || this.outlineColour,
        canvasElement.tool.strokeStyle || this.strokeStyle,
        canvasElement.tool.showRadius || this.showRadius
      )
      this.circleCreator.create(canvasElement, layer, event)
      const pos = { x: canvasElement.data[2], y: canvasElement.data[3] }
      this.circleCreator.move(canvasElement, layer, pos, event)
      layer.batchDraw()
      if (canvasElement.tool.temporary) {
        this.circleCreator.runTemporaryAnimation(this.circleCreator.getGroup(), layer)
      }
    }
  }
}
