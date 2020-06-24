import { ToolClass, ToolClassInterface } from '@/tools/Tool'
import Konva from 'konva'
import { CustomEvent } from '@/util/PointerEventMapper'
import { CanvasElementType, TransformData, Point } from '@/types/Canvas'
import Transformer from '@/tools/util/Transformer'
import Mask from '@/tools/util/Mask'
import Collection = Konva.Collection;
export default class Move extends ToolClass implements ToolClassInterface {
  private data: TransformData | undefined
  private position: { from: Point; to: Point } | undefined
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
    this.position = {
      from: {
        x: event.globalOffset.x,
        y: event.globalOffset.y
      },
      to: {
        x: event.globalOffset.x,
        y: event.globalOffset.y
      }
    }
    const targetGroup = event.konvaPointerEvent.target.parent
    if (targetGroup?.attrs.type !== CanvasElementType.TRANSFORMER && targetGroup?.attrs.isTransformEnabled !== true) {
      this.mask = new Mask({
        x: this.position.from.x,
        y: this.position.from.y,
        width: (this.position.to.x - this.position.from.x),
        height: (this.position.to.y - this.position.from.y)
      }).mask
      this.layer.add(this.mask)
      this.layer.batchDraw()
    }
  }

  // eslint-disable-next-line
  mouseMoveAction = (event: CustomEvent): void => {
    if (this.enabled) {
      if (!this.hasMoved) { this.hasMoved = true }
      if (this.position) {
        this.position.to = {
          x: event.globalOffset.x,
          y: event.globalOffset.y
        }
        if (this.mask) {
          this.mask.width(this.position.to.x - this.position.from.x)
          this.mask.height(this.position.to.y - this.position.from.y)
        }
        this.layer.batchDraw()
      }
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
