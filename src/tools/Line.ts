import { LineInterface, Tool, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import LineCreator from '@/tools/shapes/LineCreator'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class Line extends Tool implements LineInterface {
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

  mouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
    canvasElement.id = uuid()
    canvasElement.tracker = Tracker.ADDITION
    canvasElement.hasMoved = false
    canvasElement.change = false
    canvasElement.tool = {
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
    this.lineCreator['create' + this.endStyle.toUpperCase()](canvasElement, layer, event)
    canvasElement.position = this.lineCreator.getGroup().position()
  }

  mouseMoveAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (!canvasElement.hasMoved) {
      canvasElement.hasMoved = true
    }
    const pos = { x: event.globalOffset.x, y: event.globalOffset.y }
    this.lineCreator['move' + this.endStyle.toUpperCase()](canvasElement, layer, pos, event)
    layer.batchDraw()
  }

  mouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (!canvasElement.hasMoved) {
      this.lineCreator.destroy(canvasElement, layer)
    } else {
      if (canvasElement.tool.temporary) {
        this.lineCreator.runTemporaryAnimation(this.lineCreator.getGroup(), layer)
      }
      canvasElement.data = canvasElement.data.concat([event.globalOffset.x, event.globalOffset.y])
      this.send(canvasElement)
    }
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    if (canvasElement.hasMoved) {
      this.lineCreator = new LineCreator(
        canvasElement.tool.temporary || this.temporary,
        canvasElement.tool.size || this.size,
        canvasElement.tool.colour || this.colour,
        canvasElement.tool.strokeStyle || this.strokeStyle
      )
      this.lineCreator['create' + canvasElement.tool.endStyle?.toUpperCase()](canvasElement, layer, event)
      layer.batchDraw()
      if (canvasElement.tool.temporary) {
        this.lineCreator.runTemporaryAnimation(this.lineCreator.getGroup(), layer)
      }
    }
  }
}
