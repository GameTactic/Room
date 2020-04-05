<template>
  <div class="custom-canvas-tools-container">
    <v-btn-toggle dense group class="settings-left">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            v-on="on"
            class="custom-move-disabled"
            color="primary"
            max-height="40"
            @click="zoomInFunction()"
          >
            <v-icon small>fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Zoom in</span>
      </v-tooltip>
      <small
        class="custom-zoom-percentage-button"
      >
        {{ this.zoomPercentage }}%
      </small>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            v-on="on"
            class="custom-move-disabled"
            color="primary"
            max-height="40"
            @click="zoomOutFunction()"
          >
            <v-icon small>fa-minus</v-icon>
          </v-btn>
        </template>
        <span>Zoom out</span>
      </v-tooltip>
    </v-btn-toggle>
    <v-btn-toggle dense group class="settings-right">
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            :class="[isEnabledClass]"
            v-on="on"
            color="primary"
            max-height="40"
            @click="activateMoveCanvasTool"
          >
            <v-icon small>fa-hand-paper</v-icon>
          </v-btn>
        </template>
        <span>Move canvas</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            v-on="on"
            class="custom-move-disabled"
            color="primary"
            max-height="40"
            @click="centerCanvas"
          >
            <v-icon small>fa-border-all</v-icon>
          </v-btn>
        </template>
        <span>Center the canvas</span>
      </v-tooltip>
    </v-btn-toggle>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Action, Getter, namespace } from 'vuex-class'
import { EventBus } from '@/event-bus'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'
import { Tool } from '@/tools/Tool'
import { Namespaces } from '@/store'
import { StageActions, StageGetters } from '@/store/modules/stage'

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'TheCanvasTools'
})
export default class TheCanvasTools extends Vue {
  @Getter(`stage/${StageGetters.STAGE_ZOOM}`) stageZoom!: number
  @Action(`stage/${StageActions.SET_ZOOM}`) setZoom!: (payload: number) => void
  @Action(`stage/${StageActions.ZOOM_OUT}`) zoomOut!: () => void
  @Action(`stage/${StageActions.ZOOM_IN}`) zoomIn!: () => void
  @Tools.Action(ToolsAction.ENABLE_TOOL) enableTool!: (toolName: string) => void
  @Tools.Action(ToolsAction.DISABLE_TOOL) disableTool!: () => void
  @Tools.Getter(ToolGetters.ENABLED_TOOL) enabledTool?: Tool
  search = ''

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

  zoomOutFunction (): void {
    this.zoomOut()
    EventBus.$emit('zoom')
  }

  zoomInFunction (): void {
    this.zoomIn()
    EventBus.$emit('zoom')
  }

  centerCanvas (): void {
    EventBus.$emit('centerCanvas')
  }
  get isEnabledClass (): string {
    return (this.enabledTool?.name === 'moveCanvas') ? 'custom-move-active' : 'custom-move-disabled'
  }
}

</script>
<style scoped lang="scss">
  .v-btn--active .v-icon {
    color: $room-primary !important;
  }
  .custom-move-active {
    opacity: 1;
  }
  .custom-move-active:hover::before, .custom-move-active::before {
    opacity: 0.12;
  }
  .v-btn:not(.v-btn--text):not(.v-btn--outlined).custom-move-active:before {
    opacity: 0.18;
  }
  .custom-move-disabled::before {
    opacity: 0 !important;
  }
  .custom-move-disabled {
    background-color: $room-primary;
  }
  .custom-move-disabled .v-icon {
    color: $room-primary;
  }
  .custom-zoom-percentage-button {
    display: flex;
    align-items: center;
    padding-right: 0.25rem;
    padding-left: 0.25rem;
  }
  .settings-right:after {
    content: '';
    position: absolute;
    right: -50px;
    top: 1px;
    width: 100%;
    height: 100%;
    -webkit-transform-origin: 100% 0;
    -ms-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: skew(-45deg);
    -ms-transform: skew(-45deg);
    transform: skew(-45deg);
    z-index: -1;
    border-right: 1.5px solid rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    background: white;
  }
  .settings-left:after {
    content: '';
    position: absolute;
    left: -50px;
    top: 1px;
    width: 100%;
    height: 100%;
    -webkit-transform-origin: 100% 0;
    -ms-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: skew(45deg);
    -ms-transform: skew(45deg);
    transform: skew(45deg);
    z-index: -1;
    border-left: 1.5px solid rgba(0, 0, 0, 0.05);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    background: white;
  }
  .custom-canvas-tools-container {
    display: flex;
    background-color: white;
    color: $room-primary;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  .custom-btn-disabled:before {
    opacity: 0 !important;
  }
  .custom-btn-disabled .v-icon {
    color: var(--v-primary-base) !important;
  }
</style>
