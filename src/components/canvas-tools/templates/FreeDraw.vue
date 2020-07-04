<template>
  <v-card>
    <v-card-subtitle class="pb-0 pl-5 custom-hide-text">
      {{ $t('tool.template.colour') }}
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <colour-picker :value.sync="penColour" />
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5 custom-hide-text">
      {{ $t('tool.template.size') }}
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <size-picker class="px-2" :value.sync="penSize"></size-picker>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Tool } from '@/tools/tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { AppToolGetters, AppToolsAction } from '@/store/modules/app/tools'
import ColourPicker from '@/components/canvas-tools/templates/template-tools/ColourPicker.vue'
import SizePicker from '@/components/canvas-tools/templates/template-tools/SizePicker.vue'

const AppTools = namespace(Namespaces.APP_TOOLS)

@Component({
  name: 'FreeDraw',
  components: { SizePicker, ColourPicker }
})
export default class PopoutButton extends Vue {
  @AppTools.Getter(AppToolGetters.TOOL) findTool!: (name: string) => Tool
  @AppTools.Action(AppToolsAction.SET_COLOUR) setColour!: (colour: string) => void
  @AppTools.Action(AppToolsAction.SET_SIZE) setSize!: (size: number) => void

  get penSize () {
    return this.findTool('freeDraw').size || 5
  }

  set penSize (newValue: number) {
    this.setSize(newValue)
  }

  get penColour (): string {
    return this.findTool('freeDraw').colour || '#CE0000FF'
  }

  set penColour (newValue: string) {
    this.setColour(newValue)
  }
}

</script>
<style scoped lang="scss">

</style>
<style lang="scss">
.v-color-picker__controls {
  display: none;
}
</style>
