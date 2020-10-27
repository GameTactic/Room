import Konva from 'konva'
import { AdditionData, CanvasElement, CanvasElementHistory, CanvasElementType, AdditionTools } from '@/types/canvas'
import { Tool, Tracker } from '@/tools/tool'
import { CustomStageConfig } from '@/util/pointerEventMapper'
import { AppLayerGetters } from '@/store/modules/app/layer'
import { SocketCanvasGetters } from '@/store/modules/socket/canvas'
import { SocketStageGetters } from '@/store/modules/socket/stage'
import { AppStageGetters } from '@/store/modules/app/stage'
import { AppToolGetters } from '@/store/modules/app/tools'
import { Store } from 'vuex'
import { Namespaces } from '@/store'
import { FreeDraw, Circle, Entity, Line, Ruler, Text } from '@/tools'

export default class HandleRenderShapes {
  // eslint-disable-next-line no-useless-constructor
  public layer: Konva.Layer
  public canvasElements: CanvasElement[]
  public stageConfig: CustomStageConfig
  public canvasElementsHistory: CanvasElementHistory[]
  public tools: Tool[]
  public stage: Konva.Stage
  public destroyChildren: boolean

  constructor (private propStore: Store<string>, destroyChildren?: boolean) {
    this.layer = this.propStore.getters[`${Namespaces.APP_LAYER}/${AppLayerGetters.LAYER}`]
    this.canvasElements = this.propStore.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS}`]
    this.stageConfig = this.propStore.getters[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`]
    this.canvasElementsHistory = this.propStore.getters[`${Namespaces.SOCKET_CANVAS}/${SocketCanvasGetters.CANVAS_ELEMENTS_HISTORY}`]
    this.tools = this.propStore.getters[`${Namespaces.APP_TOOLS}/${AppToolGetters.TOOLS}`]
    this.stage = this.propStore.getters[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`]
    this.destroyChildren = destroyChildren ?? false
  }

  handle = (): void => {
    if (this.destroyChildren) {
      this.layer.destroyChildren()
    }
    this.handleLayerNodes()
    this.handleCanvasElements()
    this.layer.batchDraw()
  }

  handleCanvasElements = (): void => {
    this.canvasElements.forEach((canvasElement: CanvasElement) => {
      const foundGroup = this.layer.findOne((group: Konva.Group) => group.attrs.id === canvasElement.tool.groupId)
      if (!canvasElement.tool.renderCanvas && !foundGroup) {
        const { name, size, colour, temporary, groupId, showRadius, outlineColour, strokeStyle, endStyle, showCircle, textString } = canvasElement.tool
        switch (name) {
          case AdditionTools.FREEDRAW:
            canvasElement.tool = { ...new FreeDraw(name, size, colour, temporary, groupId), tool: canvasElement.tool }
            break
          case AdditionTools.CIRCLE:
            canvasElement.tool = { ...new Circle(name, size, colour, temporary, showRadius, outlineColour, strokeStyle, groupId), tool: canvasElement.tool }
            break
          case AdditionTools.ENTITY:
            canvasElement.tool = { ...new Entity(name, temporary, groupId), tool: canvasElement.tool }
            break
          case AdditionTools.LINE:
            canvasElement.tool = { ...new Line(name, size, colour, endStyle, strokeStyle, temporary, groupId), tool: canvasElement.tool }
            break
          case AdditionTools.RULER:
            canvasElement.tool = { ...new Ruler(name, size, colour, temporary, showCircle, groupId), tool: canvasElement.tool }
            break
          case AdditionTools.TEXT:
            canvasElement.tool = { ...new Text(name, size, colour, temporary, textString, groupId), tool: canvasElement.tool }
            break
          default: break
        }
      }
      if (canvasElement.isVisible) {
        this.handleCanvasElementVisible(canvasElement)
      } else {
        this.handleCanvasElementInvisible(canvasElement)
      }
      this.checkGroupAttrs(canvasElement)
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
