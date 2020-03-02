<template>
  <div>
    <p>Fill</p>
    <colour-picker :value.sync="circleColour" />
    <p>Size</p>
    <size-picker :value.sync="circleSize"></size-picker>
    <p>Outline</p>
    <colour-picker :value.sync="circleOutlineColour" />
    <v-radio-group v-model="circleStrokeStyle" row>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="strokeStyle" on-icon="fa-minus" off-icon="fa-minus" :value="0"></v-radio>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="strokeStyle" on-icon="fa-ellipsis-h" off-icon="fa-ellipsis-h" :value="1"></v-radio>
      <v-spacer></v-spacer>
    </v-radio-group>
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-switch
          v-model="circleTemporary"
          :label="circleTemporary === true ? 'Temporary' : 'Permanent'"
        ></v-switch>
        <v-spacer></v-spacer>
        <v-switch
          v-model="circleShowRadius"
          :label="circleShowRadius === true ? 'Show radius' : 'Hide radius'"
        ></v-switch>
        <v-spacer></v-spacer>
      </v-row>
    </v-container>
  </div>
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
  name: 'DrawCircle',
  components: { SizePicker, ColourPicker },
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
    return this.findTool('circle').size || 3
  }

  set circleSize (newValue: number) {
    this.setSize(newValue)
  }

  set circleColour (newValue: string) {
    this.setColour(newValue)
  }

  get circleColour (): string {
    return this.findTool('circle').colour || '#FF0000'
  }

  get circleOutlineColour (): string {
    return this.findTool('circle').outlineColour || '#FF0000'
  }

  set circleOutlineColour (newValue: string) {
    this.setOutlineColour(newValue)
  }

  get circleShowRadius (): boolean {
    return this.findTool('circle').showRadius || true
  }

  set circleShowRadius (newValue: boolean) {
    this.setShowRadius(newValue)
  }

  get circleTemporary (): boolean {
    return this.findTool('circle').temporary || false
  }

  set circleTemporary (newValue: boolean) {
    this.setTemporary(newValue)
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
