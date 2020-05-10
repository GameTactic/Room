import { Store } from 'vuex'
import { StageGetters } from '@/store/modules/stage'

export default class CenterCanvas {
  center = (store: Store<string>): void => {
    const stage = store.getters?.[`stage/${StageGetters.STAGE}`]
    const stageConfig = store.getters?.[`stage/${StageGetters.STAGE_CONFIG}`]
    const topOffset = (window.innerWidth > 899) ? 100 : 150
    const left = (window.innerWidth - stageConfig.width) / 2
    const top = (((window.innerHeight - topOffset) - stageConfig.height) / 2) + (topOffset * 0.75)
    stage.attrs.container.setAttribute('style', 'left: ' + left + 'px; top: ' + top + 'px;')
  }
}
