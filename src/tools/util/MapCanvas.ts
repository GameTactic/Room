import axios from 'axios'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import Konva from 'konva'
import store from '@/main'
import { SocketStageGetters } from '@/store/modules/socket/stage'
import { AppLayerGetters } from '@/store/modules/app/layer'
import { CanvasElementType } from '@/types/Canvas'
import { Namespaces } from '@/store'

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
    const mapDimentionRatio = 0.75
    const imgObj = new Image()
    imgObj.onload = () => {
      const el = new Konva.Image({
        image: imgObj,
        x: (stageConfig.initialWidth * ((1 - mapDimentionRatio) / 2)),
        y: (stageConfig.initialHeight * ((1 - mapDimentionRatio) / 2)),
        width: (stageConfig.initialWidth * mapDimentionRatio),
        height: (stageConfig.initialHeight * mapDimentionRatio)
      })
      const foundGroup: Konva.Node = layer.findOne((group: Konva.Node) => group instanceof Konva.Group && group.attrs.type && group.attrs.type === CanvasElementType.MAP)
      if (foundGroup && foundGroup instanceof Konva.Group) {
        foundGroup.getChildren().each(child => child.destroy())
        layer.add(foundGroup.add(el))
      } else {
        const group = new Konva.Group()
        group.attrs.type = CanvasElementType.MAP
        group.add(el)
        layer.add(group)
      }
      layer.batchDraw()
    }
    imgObj.src = stageConfig.mapSrc
  }
}
