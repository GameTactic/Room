import { ToolClass, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import { RemovalData } from '@/types/Canvas'
import uuid from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'

export default class Erase extends ToolClass {
  private data: RemovalData | undefined
  constructor (public readonly name: string,
               public readonly temporary: boolean) {
    super()
  }

  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.data = {
      removals: []
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
    if (this.enabled && this.data?.removals && this.jti) {
      this.disableTool()
      this.sendAndAddToState({
        id: uuid(),
        jti: this.jti,
        modifyType: Tracker.REMOVAL,
        modifyData: this.data,
        canvasElements: [],
        timestampModified: ISO.timestamp()
      }, SocketCanvasToolsEmit.CANVAS_TOOLS_ERASE)
    }
  }

  hideGroup = (groupId: string): void => {
    const foundGroup = this.layer.findOne((group: Konva.Group) => group.attrs.id === groupId)
    if (foundGroup) { foundGroup.destroy() }
    this.layer.batchDraw()
  }

  findAndHide = (event: CustomEvent): void => {
    const group = event.konvaPointerEvent.target.parent
    if (group && group instanceof Konva.Group && group.attrs.id && this.data?.removals && !(this.data?.removals.includes(group.attrs.id)) && group.attrs.type !== 'map') {
      this.data.removals = [ ...this.data.removals, group.attrs.id ]
      this.hideGroup(group.attrs.id)
    }
  }
}
