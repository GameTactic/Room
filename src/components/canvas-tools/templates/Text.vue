<template>
  <v-card>
    <v-card-subtitle class="pb-0 pl-5">
      Colour
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <colour-picker :value.sync="textColour" />
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5">
      Size
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <size-picker class="px-2" :value.sync="textSize"></size-picker>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Tool } from '@/tools/Tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'
import ColourPicker from '@/components/canvas-tools/templates/template-tools/ColourPicker.vue'
import SizePicker from '@/components/canvas-tools/templates/template-tools/SizePicker.vue'

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'Freedraw',
  computed: {},
  components: { SizePicker, ColourPicker }
})
export default class PopoutButton extends Vue {
  @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => Tool
  @Tools.Action(ToolsAction.SET_COLOUR) setColour!: (colour: string) => void
  @Tools.Action(ToolsAction.SET_SIZE) setSize!: (size: number) => void

  get textSize () {
    return this.findTool('text').size || 5
  }

  set textSize (newValue: number) {
    this.setSize(newValue)
  }

  get textColour (): string {
    return this.findTool('text').colour || '#CE0000FF'
  }

  set textColour (newValue: string) {
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
