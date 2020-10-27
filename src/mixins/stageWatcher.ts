import { SocketStageActions, SocketStageGetters } from '@/store/modules/socket/stage'
import { AppStageGetters } from '@/store/modules/app/stage'
import { CustomStageConfig } from '@/util/pointerEventMapper'
import CenterCanvas from '@/tools/util/centerCanvas'
import { Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import Component from 'vue-class-component'
import Konva from 'konva'
import Vue from 'vue'
import MapCanvas from '@/tools/util/mapCanvas'
import HandleRenderShapes from '@/util/handleRenderShapes'
import { Namespaces } from '@/store'

const AppStage = namespace(Namespaces.APP_STAGE)
const SocketStage = namespace(Namespaces.SOCKET_STAGE)

@Component({
  name: 'StageWatcher'
})
export default class StageWatch extends Vue {
  @AppStage.Getter(AppStageGetters.STAGE_ZOOM) stageZoom!: number
  @AppStage.Getter(AppStageGetters.STAGE) stage!: Konva.Stage
  @SocketStage.Getter(SocketStageGetters.STAGE_DIMENSIONS_INITIAL) stageDimensionsInitial!: Dimensions
  @SocketStage.Getter(SocketStageGetters.STAGE_DIMENSIONS) stageDimensions!: Dimensions
  @SocketStage.Getter(SocketStageGetters.STAGE_CONFIG) stageConfig!: CustomStageConfig
  @SocketStage.Getter(SocketStageGetters.STAGE_MAP_SRC) stageMapSrc!: string
  @SocketStage.Action(SocketStageActions.SET_DIMENSIONS) setStageDimensions!: (dimensions: Dimensions) => void
  @SocketStage.Action(SocketStageActions.SET_SCALE) setScale!: (scale: number) => void
  @SocketStage.Action(SocketStageActions.SET_DIMENSIONS_INITIAL) setDimensionsInitial!: (dimensions: Dimensions) => void

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
    const renderCanvas = new HandleRenderShapes(this.$store, true)
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
