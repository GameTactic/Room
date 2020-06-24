import Konva from 'konva'
import { AdditionData, CanvasElement, CanvasElementHistory, CanvasElementType } from '@/types/Canvas'
import { Tool, Tracker } from '@/tools/Tool'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import { AppLayerGetters } from '@/store/modules/app/layer'
import { SocketCanvasGetters } from '@/store/modules/socket/canvas'
import { SocketStageGetters } from '@/store/modules/socket/stage'
import { AppStageGetters } from '@/store/modules/app/stage'
import { AppToolGetters } from '@/store/modules/app/tools'
import { Store } from 'vuex'
import { Namespaces } from '@/store'

export default class HandleRenderShapes {
  // eslint-disable-next-line no-useless-constructor
  public layer: Konva.Layer
  public canvasElements: CanvasElement[]
  public stageConfig: CustomStageConfig
  public canvasElementsHistory: CanvasElementHistory[]
  public tools: Tool[]
  public stage: Konva.Stage

  constructor (private propStore: Store<string>) {
    this.layer = this.propStore.getters[`${Namespaces.APP_LAYER}/${AppLayerGetters.LAYER}`]
    this.canvasElements = this.propStore.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS}`]
    this.stageConfig = this.propStore.getters[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`]
    this.canvasElementsHistory = this.propStore.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS_HISTORY}`]
    this.tools = this.propStore.getters[`${Namespaces.APP_TOOLS}/${AppToolGetters.TOOLS}`]
    this.stage = this.propStore.getters[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`]
  }

  handle = (): void => {
    this.handleLayerNodes()
    this.handleCanvasElements()
    this.layer.batchDraw()
  }

  handleCanvasElements = (): void => {
    this.canvasElements.forEach((canvasElement: CanvasElement) => {
      if (canvasElement.tool.renderCanvas) {
        if (canvasElement.isVisible) {
          this.handleCanvasElementVisible(canvasElement)
        } else {
          this.handleCanvasElementInvisible(canvasElement)
        }
        this.checkGroupAttrs(canvasElement)
      }
    })
  }

  handleCanvasElementVisible = (canvasElement: CanvasElement): void => {
    if (!this.layer.find((group: Konva.Group) => group.attrs.id === canvasElement.id).length) {
      const memory: CanvasElementHistory | undefined = this.canvasElementsHistory.find((canvasElementsHistory: CanvasElementHistory) => {
        const data = canvasElementsHistory.modifyData as AdditionData
        return (canvasElementsHistory.modifyType === Tracker.ADDITION && data.additions.includes(canvasElement.id))
      })
      if (memory) {
        canvasElement.tool.renderCanvas({
          id: memory.id,
          jti: memory.jti,
          modifyType: memory.modifyType,
          modifyData: memory.modifyData,
          timestampModified: memory.timestampModified,
          canvasElements: [canvasElement]
        })
      }
    }
  }

  handleCanvasElementInvisible = (canvasElement: CanvasElement): void => {
    const foundGroup: Konva.Node = this.layer.findOne((node: Konva.Node) => node instanceof Konva.Group && node.attrs.id === canvasElement.id)
    if (foundGroup) {
      foundGroup.destroy()
    }
  }

  checkGroupAttrs = (canvasElement: CanvasElement): void => {
    const group = this.layer.findOne((group: Konva.Group) => group.attrs.id === canvasElement.id && !group.attrs.isTransforming)
    if (group) {
      // Check position
      if (group.getPosition().x !== canvasElement.attrs.position.x || group.getPosition().y !== canvasElement.attrs.position.y) {
        group.position(canvasElement.attrs.position)
      }
      // Check rotation
      if (group.rotation() !== canvasElement.attrs.rotation) {
        group.rotation(canvasElement.attrs.rotation)
      }
      // Check scale
      if (group.scaleX() !== canvasElement.attrs.scaleX || group.scaleY() !== canvasElement.attrs.scaleY) {
        group.scale({
          x: canvasElement.attrs.scaleX,
          y: canvasElement.attrs.scaleY
        })
      }
      // Check skew
      if (group.skewX() !== canvasElement.attrs.skewX || group.skewY() !== canvasElement.attrs.skewY) {
        group.skew({
          x: canvasElement.attrs.skewX,
          y: canvasElement.attrs.skewY
        })
      }
    }
  }

  handleLayerNodes = (): void => {
    this.layer.getChildren().each((group) => {
      if (
        !this.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === group.attrs.id) &&
        !group.attrs.temporary &&
        group.attrs.type !== CanvasElementType.MAP &&
        group.attrs.type !== CanvasElementType.TRANSFORMER
      ) {
        this.destroy(group as Konva.Group)
      }
    })
  }

  destroy = (group: Konva.Node): void => {
    if (group instanceof Konva.Group) {
      group.destroyChildren()
    }
    group.destroy()
  }
}
