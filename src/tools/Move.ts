import { ToolClass, ToolClassInterface } from '@/tools/Tool'
import Konva from 'konva'
import { CustomEvent } from '@/util/PointerEventMapper'
import { CanvasElementType, MoveData, RequestCanvasEntity } from '@/types/Canvas'
import Transformer from '@/tools/util/Transformer'
import Mask from '@/tools/util/Mask'
import Collection = Konva.Collection;
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
    const data = this.canvasEntity.modifyData as MoveData
    if (targetGroup?.attrs.type !== CanvasElementType.TRANSFORMER && targetGroup?.attrs.transforming !== true) {
      const mask = new Mask({
        x: data.from.x,
        y: data.from.y,
        width: (data.to.x - data.from.x),
        height: (data.to.y - data.from.y)
      }).mask
      data.mask = mask
      this.layer.add(mask)
      this.layer.batchDraw()
    }
  }

  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.canvasEntity.hasMoved) { this.canvasEntity.hasMoved = true }
      const data = this.canvasEntity.modifyData as MoveData
      if (data.from && data.to) {
        data.to = {
          x: event.globalOffset.x,
          y: event.globalOffset.y
        }
        if (data.mask) {
          data.mask.width(data.to.x - data.from.x)
          data.mask.height(data.to.y - data.from.y)
        }
        this.layer.batchDraw()
      }
    }
  }

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    const data = this.canvasEntity.modifyData as MoveData
    if (this.enabled && data.mask) {
      this.disableTool()
      const tr = new Transformer(true)
      tr.setNodes([ ...this.hitCheck(data.mask, this.layer).toArray() ])
      data.mask.destroy()
    }
    this.layer.batchDraw()
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
  // Use mask to check which shapes it covers in the layer.
  // Return the IDs of the groups that are covered by the mask and dont exist in the groups array
  hitCheck = (mask: Konva.Rect, layer: Konva.Layer): Collection<Konva.Node> => {
    return layer.find((node: Konva.Node) => {
      if (node instanceof Konva.Group &&
        (node.attrs.type === CanvasElementType.ENTITY || node.attrs.type === CanvasElementType.SHAPE) &&
        !node.attrs.temporary) {
        const r1 = mask.getClientRect({})
        const r2 = node.getClientRect({})
        return !(
          r2.x > r1.x + r1.width ||
          r2.x + r2.width < r1.x ||
          r2.y > r1.y + r1.height ||
          r2.y + r2.height < r1.y
        )
      }
    })
  }
}
