import { MoveInterface, Tool, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { CustomEvent, CustomStageEvent } from '@/util/PointerEventMapper'

export default class Move extends Tool implements MoveInterface {
  private group: Konva.Group
  constructor (public readonly name: string,
               public moveGroup: Konva.Group,
               public temporary: boolean) {
    super()
    this.group = moveGroup
  }

  // eslint-disable-next-line
  mouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, _layer: Konva.Layer): void => {
    canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
    canvasElement.hasMoved = false
    canvasElement.change = true
    canvasElement.tracker = Tracker.MOVE
    canvasElement.id = ''
    canvasElement.tool = {
      name: this.name,
      temporary: this.temporary,
      move: this.moveGroup
    }
    if (event.konvaPointerEvent.target.parent && event.konvaPointerEvent.target.parent instanceof Konva.Group && event.konvaPointerEvent.target.parent.attrs.type !== 'map') {
      this.group = event.konvaPointerEvent.target.parent
      canvasElement.id = this.group.attrs.id
    }
  }

  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (!canvasElement.hasMoved) {
      canvasElement.hasMoved = true
    }
    if (canvasElement.id !== '') {
      const pos = { x: (event.globalOffset.x - canvasElement.data[0]), y: (event.globalOffset.y - canvasElement.data[1]) }
      this.group.move({
        x: ((pos.x / event.stageConfig.width) * event.stage.width()),
        y: ((pos.y / event.stageConfig.height) * event.stage.height())
      })
      layer.batchDraw()
      canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
    }
  }

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, _layer: Konva.Layer): void => {
    if (canvasElement.hasMoved && canvasElement.id !== '') {
      canvasElement.position = { x: this.group.position().x, y: this.group.position().y }
      this.send(canvasElement)
    }
  }

  // eslint-disable-next-line
  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer, event: CustomEvent | CustomStageEvent): void => {
    const group = layer.findOne((group: Konva.Group) => group.attrs.id === canvasElement.id)
    if (group) {
      group.move({
        x: ((canvasElement.data[0] / event.stageConfig.width) * event.stage.width()),
        y: ((canvasElement.data[1] / event.stageConfig.height) * event.stage.height())
      })
    }
    layer.batchDraw()
  }
}
