import { Store } from 'vuex'
import { StageGetters } from '@/store/modules/stage'

export default class CenterCanvas {
  center = (store: Store<string>): void => {
    const stageEvent = {
      stage: store.getters?.[`stage/${StageGetters.STAGE}`],
      stageConfig: store.getters?.[`stage/${StageGetters.STAGE_CONFIG}`],
      zoom: store.getters?.[`stage/${StageGetters.STAGE_ZOOM}`]
    }
    const topOffset = (window.innerWidth > 899) ? 100 : 150
    const stageDimensions = { x: stageEvent.stage.width(), y: stageEvent.stage.height() }
    const windowDimensions = { x: window.innerWidth, y: (window.innerHeight - topOffset) }
    const left = (windowDimensions.x - stageDimensions.x) / 2
    const top = ((windowDimensions.y - stageDimensions.y) / 2) + (topOffset * 0.75)
    stageEvent.stage.attrs.container.setAttribute('style', 'left: ' + left + 'px; top: ' + top + 'px;')
  }
}
