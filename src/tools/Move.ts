import { ToolClass, ToolClassInterface } from '@/tools/Tool'
import Konva from 'konva'
import { CustomEvent } from '@/util/PointerEventMapper'
import { CanvasElementType, MoveData, RequestCanvasEntity } from '@/types/Canvas'
import Transformer from '@/tools/util/Transformer'
import Mask from '@/tools/util/Mask'
import Collection = Konva.Collection;
export default class Move extends ToolClass implements ToolClassInterface {
  private data: MoveData = { from: { x: 0, y: 0 }, to: { x: 0, y: 0 }, groups: [] }
  private mask: Konva.Rect | undefined
  private hasMoved = false
  constructor (public readonly name: string,
               public temporary: boolean) {
    super()
  }

  // eslint-disable-next-line
  mouseDownAction = (event: CustomEvent): void => {
    this.enableTool()
    this.hasMoved = false
    this.mask = undefined
    this.data = {
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
    if (targetGroup?.attrs.type !== CanvasElementType.TRANSFORMER && targetGroup?.attrs.transforming !== true) {
      this.mask = new Mask({
        x: this.data.from.x,
        y: this.data.from.y,
        width: (this.data.to.x - this.data.from.x),
        height: (this.data.to.y - this.data.from.y)
      }).mask
      this.layer.add(this.mask)
      this.layer.batchDraw()
    }
  }

  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.hasMoved) { this.hasMoved = true }
      this.data.to = {
        x: event.globalOffset.x,
        y: event.globalOffset.y
      }
      if (this.mask) {
        this.mask.width(this.data.to.x - this.data.from.x)
        this.mask.height(this.data.to.y - this.data.from.y)
      }
      this.layer.batchDraw()
    }
  }

  // eslint-disable-next-line
  mouseUpAction = (event: CustomEvent): void => {
    if (this.enabled && this.mask) {
      this.disableTool()
      if (this.hasMoved) {
        new Transformer(true).setNodes([ ...this.hitCheck().toArray() ])
      } else {
        const target = event.konvaPointerEvent.target.parent
        if (target && (target.attrs.type === CanvasElementType.ENTITY || target.attrs.type === CanvasElementType.SHAPE)) {
          new Transformer(true).setNodes([ target ])
        }
      }
      this.mask.destroy()
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
  hitCheck = (): Collection<Konva.Node> => {
    return this.layer.find((node: Konva.Node) => {
      if (node instanceof Konva.Group &&
        (node.attrs.type === CanvasElementType.ENTITY || node.attrs.type === CanvasElementType.SHAPE) &&
        !node.attrs.temporary &&
        this.mask) {
        const r1 = this.mask.getClientRect({})
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
