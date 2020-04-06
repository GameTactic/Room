<template>
  <div class="custom-tool-panel-container btn-toggle-box pa-0">
    <v-btn-toggle class="flex-column custom-tool-bar">
      <tool-container :id="id" icon="fa-arrows-alt" toolname="move" :popout="false" />
      <tool-container :id="id" icon="fa-map-pin" toolname="ping" :popout="false" />
      <tool-container :id="id" icon="fa-pen" toolname="freedraw" :popout="true"><freedraw-template /></tool-container>
      <tool-container :id="id" icon="fa-slash" toolname="line" :popout="true"><line-template /></tool-container>
      <tool-container :id="id" icon="far fa-circle" toolname="circle" :popout="true"><circle-template /></tool-container>
      <tool-container :id="id" icon="fa-ruler" toolname="ruler" :popout="true"><ruler-template /></tool-container>
      <tool-container :id="id" icon="fa-font" toolname="text" :popout="true"><text-template /></tool-container>
      <tool-container :id="id" icon="fa-eraser" toolname="erase" :popout="false"></tool-container>
      <undo-container :id="id" icon="fa-undo" toolname="undo"></undo-container>
      <redo-container :id="id" icon="fa-redo" toolname="redo"></redo-container>
    </v-btn-toggle>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ToolContainer from './canvas-tools/ToolContainer.vue'
import UndoContainer from './canvas-tools/UndoContainer.vue'
import RedoContainer from './canvas-tools/RedoContainer.vue'
import RulerTemplate from './canvas-tools/templates/Ruler.vue'
import FreedrawTemplate from './canvas-tools/templates/Freedraw.vue'
import LineTemplate from './canvas-tools/templates/Line.vue'
import { Tool } from '@/tools/Tool'
import CircleTemplate from './canvas-tools/templates/Circle.vue'
import TextTemplate from './canvas-tools/templates/Text.vue'

@Component({
  name: 'TheToolPanel',
  components: {
    ToolContainer,
    UndoContainer,
    RedoContainer,
    FreedrawTemplate,
    LineTemplate,
    CircleTemplate,
    RulerTemplate,
    TextTemplate
  }
})
export default class TheToolPanel extends Vue {
  @Prop() private id!: string;

  tools: Tool[] = []
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
@media screen and (max-height: 530px) {
  .btn-toggle-box {
  }
}
</style>
<style lang="scss">
.custom-tool-panel-container .custom-tool-bar > .v-btn.v-btn:first-child {
  border-top-width: 1.5px !important;
}
</style>
