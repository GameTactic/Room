<template>
<div>
  <div class="custom-tool-panel-container pa-0 pt-1">
    <v-btn-toggle class="flex-column custom-tool-bar">
      <tool-container icon="fa-mouse-pointer" toolName="move" />
      <tool-container icon="fa-map-pin" toolName="ping" />
      <tool-container :popout="true" icon="fa-pen" toolName="freeDraw"><free-draw-template /></tool-container>
      <tool-container :popout="true" icon="fa-slash" toolName="line"><line-template /></tool-container>
      <tool-container :popout="true" icon="far fa-circle" toolName="circle"><circle-template /></tool-container>
      <tool-container :popout="true" icon="fa-ruler" toolName="ruler"><ruler-template /></tool-container>
      <tool-container :popout="true" icon="fa-font" toolName="text"><text-template /></tool-container>
      <tool-container icon="fa-eraser" toolName="erase"></tool-container>
      <undo-container icon="fa-undo" toolName="undo"></undo-container>
      <redo-container icon="fa-redo" toolName="redo"></redo-container>
    </v-btn-toggle>
  </div>
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
import { Tool } from '@/tools/tool'
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
.custom-tool-panel-container {
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
