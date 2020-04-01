import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { Tool, Tracker } from '@/tools/Tool'

export default class HandleRenderShapes {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    public layer: Konva.Layer,
    public canvasElements: CanvasElement[],
    public tools: Tool[]) {
  }

  handle = (): void => {
    this.handleLayerNodes()
    this.handleCanvasElements()
    this.layer.batchDraw()
  }

  handleCanvasElements = (): void => {
    this.canvasElements.forEach((canvasElement: CanvasElement) => {
      if (canvasElement.tool.renderCanvas) {
        if (canvasElement.tracker === Tracker.ADDITION) {
          this.handleCanvasElementAddition(canvasElement)
        } else if (canvasElement.tracker === Tracker.REMOVAL) {
          this.handleCanvasElementRemoval(canvasElement)
        }
        this.checkGroupPosition(canvasElement)
      }
    })
  }

  handleCanvasElementAddition = (canvasElement: CanvasElement): void => {
    if (!this.layer.find((shape: Konva.Shape) => shape.attrs.id === canvasElement.id).length) {
      canvasElement.tool.renderCanvas(canvasElement, this.layer)
    }
  }

  handleCanvasElementRemoval = (canvasElement: CanvasElement): void => {
    if (this.layer.find((shape: Konva.Shape) => shape.attrs.id === canvasElement.id).length) {
      const group = this.layer.findOne((shape: Konva.Shape) => shape.attrs.id === canvasElement.id)
      if (group) {
        group.destroy()
      }
    }
  }

  checkGroupPosition = (canvasElement: CanvasElement): void => {
    const group = this.layer.findOne((shape: Konva.Group) => shape.attrs.id === canvasElement.id)
    if (group && (group.position().x !== canvasElement.position.x || group.position().y !== canvasElement.position.y)) {
      group.position(canvasElement.position)
    }
  }

  handleLayerNodes = (): void => {
    this.layer.getChildren().each((group) => {
      if (!this.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === group.attrs.id) && !group.attrs.temporary) {
        group.getChildren().each(child => child.destroy())
      }
    })
  }
}
