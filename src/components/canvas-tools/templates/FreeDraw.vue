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
import { ToolInterface } from '@/tools/Tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'
import ColourPicker from '@/components/canvas-tools/templates/template-tools/ColourPicker.vue'
import SizePicker from '@/components/canvas-tools/templates/template-tools/SizePicker.vue'

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'FreeDraw',
  computed: {},
  components: { SizePicker, ColourPicker }
})
export default class PopoutButton extends Vue {
  @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => ToolInterface
  @Tools.Action(ToolsAction.SET_COLOUR) setColour!: (colour: string) => void
  @Tools.Action(ToolsAction.SET_SIZE) setSize!: (size: number) => void

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
