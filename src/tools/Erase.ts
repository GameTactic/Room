import { EraseInterface, Tool, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import uuid from 'uuid'
import { CustomEvent } from '@/util/PointerEventMapper'

export default class Erase extends Tool implements EraseInterface {
  constructor (public readonly name: string,
               public erase: string[],
               public readonly temporary: boolean) {
    super()
  }

  mouseDownAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    canvasElement.data = [event.globalOffset.x, event.globalOffset.y]
    canvasElement.id = uuid()
    canvasElement.hasMoved = true
    canvasElement.change = false
    canvasElement.tracker = Tracker.REMOVAL
    canvasElement.tool = {
      name: this.name,
      erase: this.erase,
      temporary: false
    }
    this.findAndHide(event, canvasElement, layer)
  }

  mouseMoveAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.findAndHide(event, canvasElement, layer)
  }

  mouseUpAction = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    this.findAndHide(event, canvasElement, layer)
    this.send(canvasElement)
  }

  hideGroup = (layer: Konva.Layer, group?: string[]): void => {
    if (group) {
      group.forEach((groupId: string) => {
        const group: Konva.Collection<Konva.Node> = layer.getChildren(node => node.attrs.id === groupId)
        group.each(child => child.hide())
        layer.batchDraw()
      })
    }
  }

  findAndHide = (event: CustomEvent, canvasElement: CanvasElement, layer: Konva.Layer): void => {
    const group = event.konvaPointerEvent.target.parent
    if (group && group instanceof Konva.Group && group.attrs.id && canvasElement.tool.erase && !canvasElement.tool.erase.includes(group.attrs.id) && group.attrs.type !== 'map') {
      canvasElement.tool.erase.push(group.attrs.id)
    }
    this.hideGroup(layer, canvasElement.tool.erase)
  }

  renderCanvas = (canvasElement: CanvasElement, layer: Konva.Layer): void => {
    if (canvasElement.tracker === Tracker.REMOVAL) {
      this.hideGroup(layer, canvasElement.tool.erase)
    }
  }
}
