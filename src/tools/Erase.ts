import { ToolClass, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import { RemovalData, RequestCanvasEntity } from '@/types/Canvas'
import uuid from 'uuid'

export default class Erase extends ToolClass {
  constructor (public readonly name: string,
               public readonly temporary: boolean) {
    super()
  }

  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.resetCanvasEntity()
    this.canvasEntity.modifyData = {
      removals: []
    }
    this.canvasElement.tool = {
      name: this.name,
      temporary: false
    }
    this.findAndHide(event)
  }

  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled) {
      this.findAndHide(event)
    }
  }

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    const data = this.canvasEntity.modifyData as RemovalData
    if (this.enabled && data.removals) {
      this.disableTool()
      this.sendAndAddToState({
        id: uuid(),
        jti: this.canvasElement.jti,
        modifyType: Tracker.REMOVAL,
        modifyData: data,
        canvasElements: [],
        timestampModified: ISO.timestamp()
      })
    }
  }

  hideGroup = (groupId: string): void => {
    const foundGroup = this.layer.findOne((group: Konva.Group) => group.attrs.id === groupId)
    if (foundGroup) { foundGroup.destroy() }
    this.layer.batchDraw()
  }

  findAndHide = (event: CustomEvent): void => {
    const group = event.konvaPointerEvent.target.parent
    const data = this.canvasEntity.modifyData as RemovalData
    if (group && group instanceof Konva.Group && group.attrs.id && data.removals && !(data.removals.includes(group.attrs.id)) && group.attrs.type !== 'map') {
      data.removals = [ ...data.removals, group.attrs.id ]
      this.hideGroup(group.attrs.id)
    }
  }

  renderCanvas = (request: RequestCanvasEntity): void => {
    const data = request.modifyData as RemovalData
    if (data.removals && data.removals.length > 0) {
      data.removals.forEach((groupId: string) => this.hideGroup(groupId))
    }
  }
}
