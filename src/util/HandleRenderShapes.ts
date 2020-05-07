import Konva from 'konva'
import { AdditionData, CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import { Tool, Tracker } from '@/tools/Tool'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import { LayerGetters } from '@/store/modules/layer'
import { CanvasGetters } from '@/store/modules/canvas'
import { StageGetters } from '@/store/modules/stage'
import { ToolGetters } from '@/store/modules/tools'
import { Store } from 'vuex'

export default class HandleRenderShapes {
  // eslint-disable-next-line no-useless-constructor
  public layer: Konva.Layer
  public canvasElements: CanvasElement[]
  public stageConfig: CustomStageConfig
  public canvasElementsHistory: CanvasElementHistory[]
  public tools: Tool[]
  public stage: Konva.Stage
  constructor (private propStore: Store<string>) {
    this.layer = this.propStore.getters[`layer/${LayerGetters.LAYER}`]
    this.canvasElements = this.propStore.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS}`]
    this.stageConfig = this.propStore.getters[`stage/${StageGetters.STAGE_CONFIG}`]
    this.canvasElementsHistory = this.propStore.getters[`canvas/${CanvasGetters.CANVAS_ELEMENTS_HISTORY}`]
    this.tools = this.propStore.getters[`tools/${ToolGetters.TOOLS}`]
    this.stage = this.propStore.getters[`stage/${StageGetters.STAGE}`]
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
        this.checkGroupPosition(canvasElement)
      }
    })
  }

  handleCanvasElementVisible = (canvasElement: CanvasElement): void => {
    if (!this.layer.find((shape: Konva.Shape) => shape.attrs.id === canvasElement.id).length) {
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
    const foundGroup: Konva.Group = this.layer.findOne((group: Konva.Group) => group.attrs.id === canvasElement.id)
    if (foundGroup) {
      foundGroup.destroy()
    }
  }

  checkGroupPosition = (canvasElement: CanvasElement): void => {
    const group = this.layer.findOne((group: Konva.Group) => group.attrs.id === canvasElement.id)
    if (group && (group.getPosition().x !== canvasElement.position.x || group.getPosition().y !== canvasElement.position.y)) {
      group.position(canvasElement.position)
    }
  }

  handleLayerNodes = (): void => {
    this.layer.getChildren().each((group) => {
      if (!this.canvasElements.find((canvasElement: CanvasElement) => canvasElement.id === group.attrs.id) && !group.attrs.temporary && group.attrs.type !== 'map') {
        group.getChildren().each(child => child.destroy())
      }
    })
  }
}
