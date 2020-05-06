import { StageActions, StageGetters } from '@/store/modules/stage'
import { Store } from 'vuex'

export default class CalibrateCanvas {
  calibrate = (store: Store<string>): void => {
    const stageEvent = {
      stage: store.getters[`stage/${StageGetters.STAGE}`],
      stageConfig: store.getters[`stage/${StageGetters.STAGE_CONFIG}`],
      zoom: store.getters[`stage/${StageGetters.STAGE_ZOOM}`]
    }
    // Data for calculating new placement with some padding in the top
    const topOffset = (window.innerWidth > 899) ? 100 : 150
    const prev = { width: stageEvent.stage.width(), height: stageEvent.stage.height() }
    const dimensions = { width: stageEvent.stage.width(), height: stageEvent.stage.height() }
    // Calculate new dimensions of the stage
    if (stageEvent.stageConfig.width && stageEvent.stageConfig.height) {
      if ((window.innerWidth - stageEvent.stageConfig.width) > ((window.innerHeight - topOffset) - stageEvent.stageConfig.height)) {
        dimensions.height = ((window.innerHeight - topOffset) * (stageEvent.zoom / 100))
        dimensions.width = ((window.innerHeight - topOffset) * (stageEvent.stageConfig.width / stageEvent.stageConfig.height) * (stageEvent.zoom / 100))
      } else {
        dimensions.width = (window.innerWidth * (stageEvent.zoom / 100))
        dimensions.height = (window.innerWidth * (stageEvent.stageConfig.height / stageEvent.stageConfig.width) * (stageEvent.zoom / 100))
      }
    }
    // Makes the canvas zoom with center as focus
    stageEvent.stage.width(dimensions.width).height(dimensions.height)
    const currentDimensions = { width: (prev.width - stageEvent.stage.width()), height: (prev.height - stageEvent.stage.height()) }
    const offset = { top: stageEvent.stage.attrs.container.offsetTop, left: stageEvent.stage.attrs.container.offsetLeft }
    const style = { top: offset.top + (currentDimensions.height / 2), left: offset.left + (currentDimensions.width / 2) }
    stageEvent.stage.attrs.container.setAttribute('style', `top: ${style.top}px; left: ${style.left}px;`)
    stageEvent.stage.width(dimensions.width).height(dimensions.height)
    // Update state
    store.dispatch(`stage/${StageActions.SET_CONFIG}`, {
      scale: {
        x: (stageEvent.stage.width() / stageEvent.stageConfig.initialWidth),
        y: (stageEvent.stage.width() / stageEvent.stageConfig.initialWidth)
      },
      width: dimensions.width,
      height: dimensions.height,
      initialWidth: stageEvent.stageConfig.initialWidth,
      initialHeight: stageEvent.stageConfig.initialHeight,
      mapSrc: stageEvent.stageConfig.mapSrc,
      mapRatio: stageEvent.stageConfig.mapRatio
    })
  }
}
