import { Store } from 'vuex'
import { SocketStageGetters } from '@/store/modules/socket/stage'
import { AppStageGetters } from '@/store/modules/app/stage'
import { Namespaces } from '@/store'

export default class CenterCanvas {
  center = (store: Store<string>): void => {
    const stage = store.getters?.[`${Namespaces.APP_STAGE}/${AppStageGetters.STAGE}`]
    const stageConfig = store.getters?.[`${Namespaces.SOCKET_STAGE}/${SocketStageGetters.STAGE_CONFIG}`]
    const topOffset = (window.innerWidth > 899) ? 100 : 150
    const left = (window.innerWidth - stageConfig.width) / 2
    const top = (((window.innerHeight - topOffset) - stageConfig.height) / 2) + (topOffset * 0.75)
    stage.attrs.container.setAttribute('style', 'left: ' + left + 'px; top: ' + top + 'px;')
  }
}
