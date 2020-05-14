import { StageActions, StageGetters } from '@/store/modules/stage'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import CenterCanvas from '@/tools/util/CenterCanvas'
import { Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import Component from 'vue-class-component'
import Konva from 'konva'
import Vue from 'vue'
import MapCanvas from '@/tools/util/MapCanvas'
import HandleRenderShapes from '@/util/HandleRenderShapes'

@Component({
  name: 'StageWatch'
})
export default class StageWatch extends Vue {
  @Getter(`stage/${StageGetters.STAGE_DIMENSIONS_INITIAL}`) stageDimensionsInitial!: Dimensions
  @Getter(`stage/${StageGetters.STAGE_DIMENSIONS}`) stageDimensions!: Dimensions
  @Getter(`stage/${StageGetters.STAGE_CONFIG}`) stageConfig!: CustomStageConfig
  @Getter(`stage/${StageGetters.STAGE_ZOOM}`) stageZoom!: number
  @Getter(`stage/${StageGetters.STAGE}`) stage!: Konva.Stage
  @Action(`stage/${StageActions.SET_DIMENSIONS}`) setStageDimensions!: (dimensions: Dimensions) => void
  @Action(`stage/${StageActions.SET_SCALE}`) setScale!: (scale: number) => void
  @Action(`stage/${StageActions.SET_DIMENSIONS_INITIAL}`) setDimensionsInitial!: (dimensions: Dimensions) => void
  @Getter(`stage/${StageGetters.STAGE_MAP_SRC}`) stageMapSrc!: string

  @Watch('stageDimensionsInitial', { immediate: true })
  onStageInitialDimensions () {
    const dimensions = this.computeDimensions()
    this.setDimensionsInitial(dimensions)
    this.setStageDimensions(dimensions)
  }

  @Watch('stageZoom')
  onStageZoom (newValue: number) {
    const dimensions = this.computeDimensions()
    this.setStageDimensions({
      width: dimensions.width * (newValue / 100),
      height: dimensions.height * (newValue / 100)
    })
  }

  @Watch('stageDimensions')
  onStageDimensions (newValue: Dimensions, oldValue: Dimensions) {
    const offset = {
      top: this.stage.attrs.container.offsetTop,
      left: this.stage.attrs.container.offsetLeft
    }
    const style = {
      top: (offset.top + ((oldValue.height - newValue.height) / 2) / 2),
      left: (offset.left + ((oldValue.width - newValue.width) / 2) / 2)
    }
    this.stage.attrs.container.setAttribute('style', `top: ${style.top}px; left: ${style.left}px;`)
    this.setScale(this.stageConfig.width / this.stageConfig.initialWidth)
  }

  @Watch('stageMapSrc')
  onStageMapSrc () {
    const mapCanvas = new MapCanvas()
    const renderCanvas = new HandleRenderShapes(this.$store)
    mapCanvas.setMap().then(() => renderCanvas.handle())
  }

  created () {
    addEventListener('resize', () => {
      const dimensions = this.computeDimensions()
      this.setStageDimensions({
        width: dimensions.width * (this.stageZoom / 100),
        height: dimensions.height * (this.stageZoom / 100)
      })
      const centerCanvas = new CenterCanvas()
      centerCanvas.center(this.$store)
    })
  }

  computeDimensions () {
    const topOffset = (window.innerWidth > 899) ? 100 : 150
    const dimensions = { width: 0, height: 0 }
    if ((window.innerWidth - this.stageConfig.width) > ((window.innerHeight - topOffset) - this.stageConfig.height)) {
      dimensions.width = ((window.innerHeight - topOffset) * (this.stageConfig.width / this.stageConfig.height))
      dimensions.height = ((window.innerHeight - topOffset))
    } else {
      dimensions.width = window.innerWidth
      dimensions.height = (window.innerWidth * (this.stageConfig.height / this.stageConfig.width))
    }
    if (this.stageConfig && this.stageConfig.mapSrc !== '') {
      dimensions.width = dimensions.width / 0.75
      dimensions.height = dimensions.height / 0.75
    }
    return dimensions
  }
}

export interface Dimensions {
  width: number;
  height: number;
}
