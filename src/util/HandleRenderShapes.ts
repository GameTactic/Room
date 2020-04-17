import Konva from 'konva'
import { CanvasElement } from '@/types/Canvas'
import { Tool, Tracker } from '@/tools/Tool'
import { CustomStageEvent } from '@/util/PointerEventMapper'
import { Container } from 'konva/types/Container'
import Shape from '@/tools/shapes/Shape'

export default class HandleRenderShapes {
  // eslint-disable-next-line no-useless-constructor
  constructor (
    public layer: Konva.Layer,
    public canvasElements: CanvasElement[],
    public canvasElementsHistory: CanvasElement[],
    public tools: Tool[],
    public stageEvent: CustomStageEvent) {
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
      canvasElement.tool.renderCanvas(canvasElement, this.layer, this.stageEvent)
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
      this.handleEmptyShapes(group as Konva.Group)
      if (!this.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === group.attrs.id) && !group.attrs.temporary && group.attrs.type !== 'map') {
        group.getChildren().each(child => child.destroy())
      }
    })
  }

  deleteGroup = (group: Container<Konva.Node> | null): void => {
    if (group instanceof Konva.Group && !group.attrs.temporary) {
      const foundElement = this.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === group.attrs.id)
      const historyElements = this.canvasElementsHistory.filter((canvasElement: CanvasElement) => canvasElement.id === group.attrs.id)
      if (foundElement && historyElements) {
        this.canvasElements.splice(this.canvasElements.indexOf(foundElement), 1)
        historyElements.forEach((canvasElement: CanvasElement) => {
          this.canvasElementsHistory.splice(this.canvasElementsHistory.indexOf((canvasElement)), 1)
        })
        group.destroy()
      }
    }
  }

  handleEmptyShapes = (group: Konva.Group): void => {
    group.find((child: Konva.Node) => child instanceof Konva.Circle).each((node: Konva.Node) => this.validateCircle(node))
    group.find((child: Konva.Node) => child instanceof Konva.Line).each((node: Konva.Node) => this.validateLine(node))
    group.find((child: Konva.Node) => child instanceof Konva.Text).each((node: Konva.Node) => this.validateText(node))
  }

  validateCircle = (node: Konva.Node): void => {
    if (node instanceof Konva.Circle) {
      if (node.radius() < 10) {
        this.deleteGroup(node.parent)
      }
    }
  }

  validateLine = (node: Konva.Node): void => {
    if (node instanceof Konva.Line) {
      const threshold = 5
      const point = { x: node.attrs.points[0], y: node.attrs.points[1] }
      const validPoints = node.attrs.points.filter((num: number, index: number) => {
        if (index % 2) {
          if ((num - point.y) > threshold || (num - point.y) < (threshold * -1)) {
            return num
          }
        } else {
          if ((num - point.x) > threshold || (num - point.x) < (threshold * -1)) {
            return num
          }
        }
      })
      if (validPoints.length === 0) {
        this.deleteGroup(node.parent)
      }
    }
  }

  validateText = (node: Konva.Node): void => {
    if (node instanceof Konva.Text) {
      if (node.attrs.text.length === 0) {
        this.deleteGroup(node.parent)
      }
    }
  }
}
