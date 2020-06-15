import Konva from 'konva'
import { CanvasElement, CanvasElementType } from '@/types/Canvas'
import store from '@/main'
import { SocketCanvasAction } from '@/store/modules/socket/canvas'
import { Namespaces } from '@/store'
import { AppStageGetters } from '@/store/modules/app/stage'

export default class Transformer {
  private tr: Konva.Transformer
  private layer: Konva.Layer

  constructor (layer: Konva.Layer, config?: Konva.TransformerConfig) {
    this.layer = layer
    this.tr = new Konva.Transformer(config)
    this.tr.attrs.type = CanvasElementType.TRANSFORMER
    this.layer.add(this.tr).batchDraw()
  }

  setNodes = (nodes: Konva.Node[]): void => {
    this.tr.nodes(nodes)
    this.createListeners()
    this.layer.batchDraw()
  }

  createListeners = (): void => {
    this.tr.on('transformend', (e) => {
      const attrs: CanvasElement['attrs'] = {
        position: e.target.getPosition(),
        rotation: e.target.attrs.rotation,
        skewX: e.target.attrs.skewX,
        skewY: e.target.attrs.skewY,
        scaleX: e.target.attrs.scaleX,
        scaleY: e.target.attrs.scaleY
      }
      store.dispatch(`${Namespaces.SOCKET_CANVAS}/${SocketCanvasAction.UPDATE_CANVAS_ELEMENT_ATTRS}`, { id: e.target.attrs.id, attrs: attrs })
    })
    const stage: Konva.Stage = store.getters[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`]
    stage.on('click.transform', (e) => {
      const target = e.target.parent
      if (target) {
        const foundGroup = this.tr.nodes().filter((node: Konva.Node) => node.attrs.id === target.attrs.id)
        if (foundGroup.length === 0) {
          this.disableTransform()
        }
      } else {
        this.disableTransform()
      }
    })
  }

  disableTransform = (): void => {
    this.tr.destroy()
    this.layer.batchDraw()
  }
}
