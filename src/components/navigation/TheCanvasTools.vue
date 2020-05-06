<template>
  <div class="custom-canvas-tools-container">
    <v-btn-toggle dense group class="custom-settings-left">
      <v-tooltip bottom :open-delay="500">
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            :small="mobile"
            v-on="on"
            class="custom-move-disabled"
            color="primary"
            max-height="40"
            @click="zoomFunction(false)"
          >
            <v-icon small>fa-plus</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('navigation.canvasTools.zoomIn') }}</span>
      </v-tooltip>
      <div
        class="custom-zoom-percentage-button caption"
      >
        {{ this.zoomPercentage }}%
      </div>
      <v-tooltip bottom :open-delay="500">
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            :small="mobile"
            v-on="on"
            class="custom-move-disabled"
            color="primary"
            max-height="40"
            @click="zoomFunction(true)"
          >
            <v-icon small>fa-minus</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('navigation.canvasTools.zoomOut') }}</span>
      </v-tooltip>
      <v-divider vertical inset />
    </v-btn-toggle>
    <v-btn-toggle dense group class="custom-settings-right">
      <v-tooltip bottom :open-delay="500">
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            :small="mobile"
            :class="[isEnabledClass]"
            v-on="on"
            color="primary"
            max-height="40"
            @click="activateMoveCanvasTool"
          >
            <v-icon small>fa-hand-paper</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('navigation.canvasTools.moveCanvas') }}</span>
      </v-tooltip>
      <v-tooltip bottom :open-delay="500">
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            :small="mobile"
            v-on="on"
            class="custom-move-disabled"
            color="primary"
            max-height="40"
            @click="centerFunction"
          >
            <v-icon small>fa-compress-arrows-alt</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('navigation.canvasTools.centerCanvas') }}</span>
      </v-tooltip>
    </v-btn-toggle>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, Getter, namespace } from 'vuex-class'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'
import { ToolInterface } from '@/tools/Tool'
import { Namespaces } from '@/store'
import { StageActions, StageGetters } from '@/store/modules/stage'
import Konva from 'konva'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import CenterCanvas from '@/tools/util/CenterCanvas'

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'TheCanvasTools'
})
export default class TheCanvasTools extends Vue {
  @Prop() private mobile!: boolean;
  @Getter(`stage/${StageGetters.STAGE_ZOOM}`) stageZoom!: number
  @Getter(`stage/${StageGetters.STAGE}`) stage!: Konva.Stage
  @Getter(`stage/${StageGetters.STAGE_CONFIG}`) stageConfig!: CustomStageConfig
  @Action(`stage/${StageActions.SET_ZOOM}`) setZoom!: (payload: number) => void
  @Action(`stage/${StageActions.ZOOM_OUT}`) zoomOut!: () => void
  @Action(`stage/${StageActions.ZOOM_IN}`) zoomIn!: () => void
  @Action(`stage/${StageActions.SET_CONFIG}`) setStageConfig!: (config: CustomStageConfig) => void
  @Tools.Action(ToolsAction.ENABLE_TOOL) enableTool!: (toolName: string) => void
  @Tools.Action(ToolsAction.DISABLE_TOOL) disableTool!: () => void
  @Tools.Getter(ToolGetters.ENABLED_TOOL) enabledTool?: ToolInterface

  mounted () {
    const centerCanvas = new CenterCanvas()
    centerCanvas.center(this.$store)
    window.addEventListener('resize', () => {
      centerCanvas.center(this.$store)
    })
  }

  beforeDestroy () {
    window.removeEventListener('resize', () => null)
  }

  get zoomPercentage (): number {
    return this.stageZoom
  }

  activateMoveCanvasTool (): void {
    if (this.enabledTool?.name !== 'moveCanvas') {
      this.enableTool('moveCanvas')
    } else {
      this.disableTool()
    }
  }

  zoomFunction (zoomOut: boolean): void {
    (zoomOut) ? this.zoomOut() : this.zoomIn()
  }

  centerFunction (): void {
    const centerCanvas = new CenterCanvas()
    centerCanvas.center(this.$store)
  }
  get isEnabledClass (): string {
    return (this.enabledTool?.name === 'moveCanvas') ? 'custom-move-active' : 'custom-move-disabled'
  }
}

</script>
<style scoped lang="scss">
  .v-btn--active .v-icon {
    color: $room-primary;
  }
  .custom-move-active {
    opacity: 1;
    &:hover {
      &::before {
        opacity: 0.12;
      }
    };
    &:before {
      opacity: 0.12;
    };
  }
  .v-btn:not(.v-btn--text):not(.v-btn--outlined).custom-move-active:before {
    opacity: 0.18;
  }
  .custom-move-disabled {
    background-color: $room-primary;
    &:before {
      opacity: 0 !important; // override
    };
    .v-icon {
      color: $room-primary;
    }
  }
  .custom-zoom-percentage-button {
    display: flex;
    align-items: center;
    padding-right: 0.25rem;
    padding-left: 0.25rem;
  }
  @mixin skewElement {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-transform-origin: 100% 0;
    -ms-transform-origin: 100% 0;
    transform-origin: 100% 0;
    z-index: -1;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    background: white;
  }
  .custom-settings-right:after {
    @include skewElement;
    width: 200px;
    right: -50px;
    -webkit-transform: skew(-45deg);
    -ms-transform: skew(-45deg);
    transform: skew(-45deg);
    border-right: 1.5px solid rgba(0, 0, 0, 0.05);
  }
  .custom-settings-left:after {
    @include skewElement;
    left: -50px;
    width: 200px;
    -webkit-transform: skew(45deg);
    -ms-transform: skew(45deg);
    transform: skew(45deg);
    border-left: 1.5px solid rgba(0, 0, 0, 0.05);
  }
  .custom-canvas-tools-container {
    display: flex;
    color: $room-primary;
  }
  .custom-btn-disabled {
    &:before {
      opacity: 0;
    }
    .v-icon {
      color: $room-primary;
    }
  }
</style>
