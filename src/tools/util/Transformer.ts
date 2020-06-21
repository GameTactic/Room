import Konva from 'konva'
import { CanvasElement, CanvasElementType, Point } from '@/types/Canvas'
import store from '@/main'
import { SocketCanvasAction } from '@/store/modules/socket/canvas'
import { Namespaces } from '@/store'
import { AppStageGetters } from '@/store/modules/app/stage'
import { ToolClass } from '@/tools/Tool'
import { KonvaPointerEvent } from 'konva/types/PointerEvents'
import { KonvaEventObject } from 'konva/types/Node'

export default class Transformer extends ToolClass {
  private tr: Konva.Transformer
  private isMouseDownEnabled = false
  private readonly isAllowMove: boolean
  private moveData: { from: Point; to: Point; prev: Point }

  constructor (isAllowMove: boolean) {
    super()
    this.tr = new Konva.Transformer({
      padding: 10
    })
    this.tr.attrs.type = CanvasElementType.TRANSFORMER
    this.layer.add(this.tr).batchDraw()
    this.tr.keepRatio(false)
    this.isAllowMove = isAllowMove
    this.moveData = {
      from: { x: 0, y: 0 },
      to: { x: 0, y: 0 },
      prev: { x: 0, y: 0 }
    }
  }

  setNodes = (nodes: Konva.Node[]): void => {
    nodes.forEach((node: Konva.Node) => {
      node.attrs.transforming = true
    })
    this.tr.nodes(nodes)
    this.createListeners()
    this.layer.batchDraw()
  }

  createListeners = (): void => {
    this.updateOnTransformEnd()
    this.checkDisableTransform()
    this.handleCenterScaleAndRatio()
    if (this.isAllowMove) {
      this.createNodeEventListeners()
    }
  }

  updateOnTransformEnd = (): void => {
    this.tr.on('transformend', () => {
      this.updateNodes()
    })
  }

  checkDisableTransform = (): void => {
    const stage: Konva.Stage = store.getters[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`]
    stage.on('mousedown.transform', (e) => {
      const target = e.target.parent
      if (target) {
        const foundGroup = this.tr.nodes().filter((node: Konva.Node) => node.attrs.id === target.attrs.id)
        if (foundGroup.length === 0 && target.attrs.type !== CanvasElementType.TRANSFORMER && !this.isMouseDownEnabled) {
          this.disableTransform()
        }
      } else {
        this.disableTransform()
      }
    })
    if (this.isAllowMove) {
      stage.on('mousemove.transform', (e: KonvaEventObject<MouseEvent>) => {
        this.onMouseMove(e as KonvaPointerEvent)
      })
      stage.on('mouseup.transform', (e: KonvaEventObject<MouseEvent>) => {
        this.onMouseUp(e as KonvaPointerEvent)
      })
    }
  }

  handleCenterScaleAndRatio = (): void => {
    this.tr.on('transform.transform', (e: KonvaEventObject<MouseEvent>) => {
      if (e.evt.shiftKey) {
        this.tr.centeredScaling(true)
      } else {
        this.tr.centeredScaling(false)
      }
      if (e.evt.ctrlKey) {
        this.tr.keepRatio(true)
      } else {
        this.tr.keepRatio(false)
      }
    })
  }

  disableTransform = (): void => {
    this.removeEventListeners()
    const nodes: Konva.Node[] = this.tr.getNodes()
    nodes.forEach((node: Konva.Node) => {
      node.attrs.transforming = false
    })
    this.tr.destroy()
    this.layer.batchDraw()
  }

  removeEventListeners = (): void => {
    const stage: Konva.Stage = store.getters[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`]
    stage.off('mousedown.transform')
    stage.off('mousemove.transform')
    stage.off('mouseup.transform')
    this.tr.off('transform.transform')
    this.tr.off('transformend.transform')
  }

  createNodeEventListeners = (): void => {
    const nodes: Konva.Node[] = this.tr.getNodes()
    nodes.forEach((node: Konva.Node) => {
      node.on('mousedown', (e: KonvaEventObject<MouseEvent>) => {
        this.onMouseDown(e as KonvaPointerEvent)
      })
    })
  }
  // eslint-disable-next-line
  onMouseDown = (e: KonvaPointerEvent): void => {
    this.isMouseDownEnabled = true
    this.tr.visible(false)
    this.moveData = {
      from: { x: e.evt.x, y: e.evt.y },
      to: { x: e.evt.x, y: e.evt.y },
      prev: { x: e.evt.x, y: e.evt.y }
    }
  }
  // eslint-disable-next-line
  onMouseMove = (e: KonvaPointerEvent): void => {
    if (this.isMouseDownEnabled) {
      const stageZoom: number = store.getters[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE_ZOOM}`]
      this.moveData.to = {
        x: e.evt.x,
        y: e.evt.y
      }
      this.tr.getNodes().forEach((node: Konva.Node) => {
        node.move({
          x: (this.moveData.to.x - this.moveData.prev.x) / (stageZoom / 100),
          y: (this.moveData.to.y - this.moveData.prev.y) / (stageZoom / 100)
        })
      })
      this.moveData.prev = this.moveData.to
    }
  }
  // eslint-disable-next-line
  onMouseUp = (e: KonvaPointerEvent): void => {
    if (this.isMouseDownEnabled) {
      this.isMouseDownEnabled = false
      this.tr.visible(true)
      this.updateNodes()
    }
  }

  updateNodes = (): void => {
    this.tr.getNodes().forEach((node: Konva.Node) => {
      const attrs: CanvasElement['attrs'] = {
        position: {
          x: this.formatXInverse(node.position().x),
          y: this.formatYInverse(node.position().y)
        },
        rotation: node.rotation(),
        skewX: node.skewX(),
        skewY: node.skewY(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY()
      }
      store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.UPDATE_CANVAS_ELEMENT_ATTRS}`, { id: node.attrs.id, attrs: attrs })
    })
  }
}
