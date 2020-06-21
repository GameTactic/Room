import axios from 'axios'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import Konva from 'konva'
import store from '@/main'
import { SocketStageGetters } from '@/store/modules/socket/stage'
import { AppLayerGetters } from '@/store/modules/app/layer'
import { CanvasElementType } from '@/types/Canvas'
import { Namespaces } from '@/store'
import { EventBus } from '@/event-bus'

export default class MapCanvas {
  async setMap () {
    const stageConfig: CustomStageConfig = store.getters[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`]
    const layer: Konva.Layer = store.getters[`${Namespaces.APP_LAYER}/${AppLayerGetters.LAYER}`]
    await axios.get(stageConfig.mapSrc).then((response) => {
      if (response.status === 200) {
        this.createMapElement(stageConfig, layer)
      }
    })
  }

  createMapElement = (stageConfig: CustomStageConfig, layer: Konva.Layer): void => {
    const imgObj = new Image()
    imgObj.onload = () => {
      EventBus.$emit('MapChanging', false)
      const foundGroup: Konva.Node = layer.findOne((group: Konva.Node) => group instanceof Konva.Group && group.attrs.type === CanvasElementType.MAP)
      if (foundGroup && foundGroup instanceof Konva.Group) {
        foundGroup.destroy()
      }
      const group: Konva.Group = new Konva.Group()
      group.attrs.type = CanvasElementType.MAP
      layer.add(group.add(this.createKonvaMapElement(imgObj, stageConfig)))
      layer.findOne((node: Konva.Node) => node.attrs.type === CanvasElementType.MAP).moveToBottom()
      layer.batchDraw()
    }
    imgObj.src = stageConfig.mapSrc
  }

  createKonvaMapElement = (imgObj: HTMLImageElement, stageConfig: CustomStageConfig): Konva.Image => {
    const mapDimensionRatio = 0.75
    return new Konva.Image({
      image: imgObj,
      x: (stageConfig.initialWidth * ((1 - mapDimensionRatio) / 2)),
      y: (stageConfig.initialHeight * ((1 - mapDimensionRatio) / 2)),
      width: (stageConfig.initialWidth * mapDimensionRatio),
      height: (stageConfig.initialHeight * mapDimensionRatio)
    })
  }
}
