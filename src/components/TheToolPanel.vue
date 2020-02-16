<template>
  <v-btn-toggle class="flex-column btn-toggle-box">
    <tool-container :id="id" icon="fa-map-pin" toolname="ping" :popout="false" />
    <tool-container :id="id" icon="fa-pen" toolname="freedraw" :popout="true"><freedraw-template /></tool-container>
    <tool-container :id="id" icon="fa-eraser" toolname="erase" :popout="false"></tool-container>
  </v-btn-toggle>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ToolContainer from './canvas-tools/ToolContainer.vue'
import FreedrawTemplate from './canvas-tools/templates/Freedraw.vue'
import { Tool } from '@/tools/Tool'

@Component({
  name: 'TheToolPanel',
  components: {
    ToolContainer,
    FreedrawTemplate
  }
})
export default class TheToolPanel extends Vue {
  @Prop() private id!: string;

  tools: Tool[] = []
}
</script>
<style scoped lang="scss">
.btn-toggle-box{
  margin: 0.25rem;
  position: fixed;
}
</style>
