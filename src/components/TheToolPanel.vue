<template>
  <div class="custom-tool-panel-container btn-toggle-box pa-0 pt-1">
    <v-btn-toggle class="flex-column custom-tool-bar">
      <tool-container icon="fa-arrows-alt" toolname="move" :popout="false" />
      <tool-container icon="fa-map-pin" toolname="ping" :popout="false" />
      <tool-container icon="fa-pen" toolname="freeDraw" :popout="true"><free-draw-template /></tool-container>
      <tool-container icon="fa-slash" toolname="line" :popout="true"><line-template /></tool-container>
      <tool-container icon="far fa-circle" toolname="circle" :popout="true"><circle-template /></tool-container>
      <tool-container icon="fa-ruler" toolname="ruler" :popout="true"><ruler-template /></tool-container>
      <tool-container icon="fa-font" toolname="text" :popout="true"><text-template /></tool-container>
      <tool-container icon="fa-eraser" toolname="erase" :popout="false"></tool-container>
      <undo-container icon="fa-undo" toolname="undo"></undo-container>
      <redo-container icon="fa-redo" toolname="redo"></redo-container>
    </v-btn-toggle>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ToolContainer from './canvas-tools/ToolContainer.vue'
import UndoContainer from './canvas-tools/UndoContainer.vue'
import RedoContainer from './canvas-tools/RedoContainer.vue'
import RulerTemplate from './canvas-tools/templates/Ruler.vue'
import FreeDrawTemplate from './canvas-tools/templates/FreeDraw.vue'
import LineTemplate from './canvas-tools/templates/Line.vue'
import { Tool } from '@/tools/Tool'
import CircleTemplate from './canvas-tools/templates/Circle.vue'
import TextTemplate from './canvas-tools/templates/Text.vue'
import { namespace } from 'vuex-class'
import { AppToolsAction } from '@/store/modules/app/tools'
import { Namespaces } from '@/store'

const AppTools = namespace(Namespaces.APP_TOOLS)

@Component({
  name: 'TheToolPanel',
  components: {
    ToolContainer,
    UndoContainer,
    RedoContainer,
    FreeDrawTemplate,
    LineTemplate,
    CircleTemplate,
    RulerTemplate,
    TextTemplate
  }
})
export default class TheToolPanel extends Vue {
  @AppTools.Action(AppToolsAction.DISABLE_TOOL) disableTool!: () => void

  tools: Tool[] = []

  created () {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.disableTool()
      }
    })
  }
}
</script>
<style scoped lang="scss">
.btn-toggle-box {
  top: 48px;
  position: fixed;
  max-height: calc(100% - 48px);
  overflow: auto;
  width: 72px;
  background: transparent;
}

.custom-tool-bar {
  border-radius: 0;
}
</style>
<style lang="scss">
.custom-tool-panel-container .custom-tool-bar > .v-btn.v-btn:first-child {
  border-top-width: 1.5px !important;
}
</style>
