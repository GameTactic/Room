import axios from 'axios'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import Konva from 'konva'

export default class MapCanvas {
  async setMap (stageConfig: CustomStageConfig, layer: Konva.Layer) {
    await axios.get(stageConfig.mapSrc).then((response) => {
      if (response.status === 200) {
        this.createMapElement(stageConfig, layer)
      }
    })
  }

  createMapElement = (stageConfig: CustomStageConfig, layer: Konva.Layer): void => {
    const imgObj = new Image()
    imgObj.onload = () => {
      const el = new Konva.Image({
        image: imgObj,
        x: (stageConfig.initialWidth * 0.125),
        y: (stageConfig.initialHeight * 0.125),
        width: (stageConfig.initialWidth * 0.75),
        height: (stageConfig.initialHeight * 0.75)
      })
      const group = new Konva.Group()
      group.attrs.type = 'map'
      group.add(el)
      layer.add(group)
      layer.batchDraw()
    }
    imgObj.src = stageConfig.mapSrc
  }
}
