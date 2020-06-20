import Konva from 'konva'
import { CanvasElement, CanvasElementType, Point } from '@/types/Canvas'
import store from '@/main'
import { SocketCanvasAction } from '@/store/modules/socket/canvas'
import { Namespaces } from '@/store'
import { AppStageGetters } from '@/store/modules/app/stage'
import { ToolClass } from '@/tools/Tool'
import KonvaEventObject = Konva.KonvaEventObject;

export default class Transformer extends ToolClass {
  private tr: Konva.Transformer
  private moveEnabled = false
  private readonly allowMove: boolean
  private moveData: { from: Point; to: Point; prev: Point }

  constructor (allowMove: boolean, config?: Konva.TransformerConfig) {
    super()
    this.tr = new Konva.Transformer(config)
    this.tr.attrs.type = CanvasElementType.TRANSFORMER
    this.layer.add(this.tr).batchDraw()
    this.tr.keepRatio(false)
    this.allowMove = allowMove
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
    if (this.allowMove) {
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
        if (foundGroup.length === 0 && target.attrs.type !== CanvasElementType.TRANSFORMER && !this.moveEnabled) {
          this.disableTransform()
        }
      } else {
        this.disableTransform()
      }
    })
    if (this.allowMove) {
      stage.on('mousemove.transform', (e: KonvaEventObject<MouseEvent>) => {
        this.onMouseMove(e)
      })
      stage.on('mouseup.transform', (e: KonvaEventObject<MouseEvent>) => {
        this.onMouseUp(e)
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
    const nodes = this.tr.getNodes()
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
    const nodes = this.tr.getNodes()
    nodes.forEach((node: Konva.Node) => {
      node.on('mousedown', (e: KonvaEventObject<MouseEvent>) => {
        this.onMouseDown(e)
      })
    })
  }
  // eslint-disable-next-line
  onMouseDown = (e: KonvaEventObject<MouseEvent>): void => {
    this.moveEnabled = true
    this.tr.visible(false)
    this.moveData = {
      from: { x: e.evt.x, y: e.evt.y },
      to: { x: e.evt.x, y: e.evt.y },
      prev: { x: e.evt.x, y: e.evt.y }
    }
  }
  // eslint-disable-next-line
  onMouseMove = (e: KonvaEventObject<MouseEvent>): void => {
    if (this.moveEnabled) {
      this.moveData.prev = this.moveData.to
      this.moveData.to = {
        x: e.evt.x,
        y: e.evt.y
      }
      this.tr.getNodes().forEach((node: Konva.Node) => {
        node.move({
          x: (this.moveData.to.x - this.moveData.prev.x),
          y: (this.moveData.to.y - this.moveData.prev.y)
        })
      })
    }
  }
  // eslint-disable-next-line
  onMouseUp = (e: KonvaEventObject<MouseEvent>): void => {
    if (this.moveEnabled) {
      this.moveEnabled = false
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
        skewX: this.formatXInverse(node.skewX()),
        skewY: this.formatYInverse(node.skewY()),
        scaleX: this.formatXInverse(node.scaleX()),
        scaleY: this.formatYInverse(node.scaleY())
      }
      store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.UPDATE_CANVAS_ELEMENT_ATTRS}`, { id: node.attrs.id, attrs: attrs })
    })
  }
}
