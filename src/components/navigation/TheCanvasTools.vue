<template>
  <div class="custom-canvas-tools-container">
    <v-btn-toggle dense group>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            v-on="on"
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
    <v-divider vertical />
    <v-btn-toggle dense group>
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
    return (this.enabledTool?.name === 'moveCanvas') ? 'v-btn--active' : 'custom-btn-disabled'
  }
}

</script>
<style scoped lang="scss">
.custom-zoom-percentage-button {
  display: flex;
  align-items: center;
  padding-right: 0.25rem;
  padding-left: 0.25rem;
}

.custom-canvas-tools-container {
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
.custom-btn-disabled:before {
  opacity: 0 !important;
}
.custom-btn-disabled .v-icon {
  color: var(--v-primary-base) !important;
}

</style>
