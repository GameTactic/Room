<template>
  <v-card>
    <v-card-subtitle class="pb-0 pl-5">
      Fill
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <colour-picker-transparency :value.sync="circleColour" />
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5">
      Size
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <size-picker class="px-2" :value.sync="circleSize"></size-picker>
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5">
      Outline
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <colour-picker :value.sync="circleOutlineColour" />
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5">
      Stroke style
    </v-card-subtitle>
    <v-card-actions class="pb-0">
      <v-radio-group v-model="circleStrokeStyle" row class="mt-1 px-3 flex-fill">
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-radio v-on="on" class="mr-0" name="strokeStyle" on-icon="fa-minus" off-icon="fa-minus" :value="0"></v-radio>
          </template>
          <span>Normal Line</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-radio v-on="on" class="mr-0" name="strokeStyle" on-icon="fa-ellipsis-h" off-icon="fa-ellipsis-h" :value="1"></v-radio>
          </template>
          <span>Dashed Line</span>
        </v-tooltip>
        <v-spacer></v-spacer>
      </v-radio-group>
    </v-card-actions>
    <v-card-actions class="py-0 px-2">
      <v-row>
        <v-spacer></v-spacer>
        <v-switch
          v-model="circleTemporary"
          class="mt-0"
          :label="circleTemporary ? 'Permanent' : 'Temporary'"
        ></v-switch>
        <v-spacer></v-spacer>
        <v-switch
          v-model="circleShowRadius"
          class="mt-0"
          :label="circleShowRadius ? 'Show Radius' : 'Hide Radius'"
        ></v-switch>
        <v-spacer></v-spacer>
      </v-row>
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
import ColourPickerTransparency from '@/components/canvas-tools/templates/template-tools/ColourPickerTransparency.vue'
import SizePicker from '@/components/canvas-tools/templates/template-tools/SizePicker.vue'

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'DrawCircle',
  components: { SizePicker, ColourPicker, ColourPickerTransparency },
  computed: {}
})
export default class PopoutButton extends Vue {
  @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => Tool
  @Tools.Action(ToolsAction.SET_SIZE) setSize!: (size: number) => void
  @Tools.Action(ToolsAction.SET_COLOUR) setColour!: (colour: string) => void
  @Tools.Action(ToolsAction.SET_SHOW_RADIUS) setShowRadius!: (showRadius: boolean) => void
  @Tools.Action(ToolsAction.SET_OUTLINE_COLOUR) setOutlineColour!: (outlineColour: string) => void
  @Tools.Action(ToolsAction.SET_TEMPORARY) setTemporary!: (temporary: boolean) => void
  @Tools.Action(ToolsAction.SET_STROKE_STYLE) setStrokeStyle!: (strokeStyle: number) => void

  get circleSize () {
    return this.findTool('circle').size || 5
  }

  set circleSize (newValue: number) {
    this.setSize(newValue)
  }

  get circleColour (): string {
    return this.findTool('circle').colour || '#CE0000FF'
  }

  set circleColour (newValue: string) {
    this.setColour(newValue)
  }

  get circleOutlineColour (): string {
    return this.findTool('circle').outlineColour || '#CE0000FF'
  }

  set circleOutlineColour (newValue: string) {
    this.setOutlineColour(newValue)
  }

  get circleShowRadius (): boolean {
    return this.findTool('circle').showRadius || false
  }

  set circleShowRadius (newValue: boolean) {
    this.setShowRadius(newValue)
  }

  get circleTemporary (): boolean {
    return !this.findTool('circle').temporary || false
  }

  set circleTemporary (newValue: boolean) {
    this.setTemporary(!newValue)
  }

  get circleStrokeStyle (): number {
    return this.findTool('circle').strokeStyle || 0
  }

  set circleStrokeStyle (newValue: number) {
    this.setStrokeStyle(newValue)
  }
}

</script>
<style scoped lang="scss">

</style>
