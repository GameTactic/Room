import { VueKonvaStage } from '@/types/Canvas'
import { CustomStageConfig } from '@/util/PointerEventMapper'

export default class HandleCanvas {
  static handleCenterCanvas = (stage: VueKonvaStage): void => {
    const topOffset = (window.innerWidth > 899) ? 100 : 150
    const stageDimensions = { x: stage.$el.getBoundingClientRect().width, y: stage.$el.getBoundingClientRect().height }
    const windowDimensions = { x: window.innerWidth, y: (window.innerHeight - topOffset) }
    const left = (windowDimensions.x - stageDimensions.x) / 2
    const top = ((windowDimensions.y - stageDimensions.y) / 2) + (topOffset * 0.75)
    stage.$el.setAttribute('style', 'left: ' + left + 'px; top: ' + top + 'px;')
  }

  static handleZoom = (stage: VueKonvaStage, stageZoom: number, stageConfig: CustomStageConfig, onLoad?: boolean): CustomStageConfig => {
    const topOffset = (window.innerWidth > 899) ? 100 : 150
    const prev = { width: stage.width(), height: stage.height() }
    const dimensions: { width: number; height: number } = {
      width: stage.width(),
      height: stage.height()
    }
    if (stageConfig.width && stageConfig.height) {
      if ((window.innerWidth - stageConfig.width) > ((window.innerHeight - topOffset) - stageConfig.height)) {
        dimensions.height = ((window.innerHeight - topOffset) * (stageZoom / 100))
        dimensions.width = ((window.innerHeight - topOffset) * (stageConfig.width / stageConfig.height) * (stageZoom / 100))
      } else {
        dimensions.width = (window.innerWidth * (stageZoom / 100))
        dimensions.height = (window.innerWidth * (stageConfig.height / stageConfig.width) * (stageZoom / 100))
      }
    }
    stage.width(dimensions.width).height(dimensions.height)
    if (!onLoad) {
      const currentDimensions = { width: (prev.width - stage.width()), height: (prev.height - stage.height()) }
      const offset = { top: stage.attrs.container.offsetTop, left: stage.attrs.container.offsetLeft }
      const style = {
        top: offset.top + (currentDimensions.height / 2),
        left: offset.left + (currentDimensions.width / 2)
      }
      stage.attrs.container.setAttribute('style', 'top: ' + style.top + 'px; left: ' + style.left + 'px;')
    }
    return {
      scale: {
        x: (stage.width() / stageConfig.initialWidth),
        y: (stage.width() / stageConfig.initialWidth)
      },
      width: dimensions.width,
      height: dimensions.height,
      initialWidth: stageConfig.initialWidth,
      initialHeight: stageConfig.initialHeight,
      mapSrc: stageConfig.mapSrc
    }
  }
}
