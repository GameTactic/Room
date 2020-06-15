import { ToolClass, ToolClassInterface, Tracker } from '@/tools/Tool'
import Konva from 'konva'
import { CustomEvent } from '@/util/PointerEventMapper'
import { ISO } from '@/util/ISO'
import { CanvasElementType, MoveData, RequestCanvasEntity } from '@/types/Canvas'
import uuid from 'uuid'
import { SocketCanvasToolsEmit } from '@/store/modules/socket'
import Transformer from '@/tools/util/Transformer'
export default class Move extends ToolClass implements ToolClassInterface {
  constructor (public readonly name: string,
               public temporary: boolean) {
    super()
  }

  // eslint-disable-next-line
  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.resetCanvasEntity()
    this.canvasEntity.modifyData = {
      from: {
        x: event.globalOffset.x,
        y: event.globalOffset.y
      },
      to: {
        x: event.globalOffset.x,
        y: event.globalOffset.y
      },
      groups: []
    }
    const targetGroup = event.konvaPointerEvent.target.parent
    if (targetGroup && targetGroup instanceof Konva.Group && targetGroup.attrs.type !== CanvasElementType.MAP && targetGroup.attrs.id) {
      const data = this.canvasEntity.modifyData as MoveData
      data.groups = [targetGroup.attrs.id]
    }
    // If we want to move multiple groups at once we will have to add that in here
    // Requires code to create a mask when clicking and dragging instead of moving.
    // Should be done if no targetGroup was found
  }

  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.canvasEntity.hasMoved) { this.canvasEntity.hasMoved = true }
      const data = this.canvasEntity.modifyData as MoveData
      if (data.from && data.to && data.groups.length > 0) {
        const prevMove = { ...data.to }
        data.to = {
          x: event.globalOffset.x,
          y: event.globalOffset.y
        }
        data.groups.forEach((groupId: string) => {
          const foundGroup: Konva.Node = this.layer.findOne((node: Konva.Node) => node instanceof Konva.Group && node.attrs.id === groupId)
          if (foundGroup) {
            foundGroup.move({
              x: ((data.to.x - prevMove.x) / event.stageConfig.width * event.stage.width()),
              y: ((data.to.y - prevMove.y) / event.stageConfig.height * event.stage.height())
            })
          }
        })
        this.layer.batchDraw()
      }
    }
  }

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    if (this.enabled && this.canvasEntity.hasMoved) {
      this.disableTool()
      const data = this.canvasEntity.modifyData as MoveData
      this.sendAndAddToState({
        id: uuid(),
        jti: this.canvasEntity.canvasElement.jti,
        modifyData: data,
        modifyType: Tracker.MOVE,
        timestampModified: ISO.timestamp(),
        canvasElements: []
      }, SocketCanvasToolsEmit.CANVAS_TOOLS_MOVE)
    } else if (this.enabled && !this.canvasEntity.hasMoved) {
      this.disableTool()
      const targetGroup = event.konvaPointerEvent.target.parent
      if (targetGroup && targetGroup instanceof Konva.Group && targetGroup.attrs.type !== CanvasElementType.MAP) {
        const tr = new Transformer(this.layer)
        tr.setNodes([targetGroup])
      }
    }
  }

  // eslint-disable-next-line
  renderCanvas = (request: RequestCanvasEntity): void => {
    const data = request.modifyData as MoveData
    if (data.groups && data.groups.length > 0 && data.from && data.to) {
      data.groups.forEach((groupId: string) => {
        const foundGroup: Konva.Node = this.layer.findOne((node: Konva.Node) => node instanceof Konva.Group && node.attrs.id === groupId)
        if (foundGroup) {
          const groupPos = foundGroup.getPosition()
          const pos = {
            x: (data.to.x - data.from.x) + groupPos.x,
            y: (data.to.y - data.from.y) + groupPos.y
          }
          foundGroup.move({
            x: ((pos.x / this.stageEvent.stageConfig.width) * this.stageEvent.stage.width()),
            y: ((pos.y / this.stageEvent.stageConfig.height) * this.stageEvent.stage.height())
          })
        }
      })
      this.layer.batchDraw()
    }
  }
}
