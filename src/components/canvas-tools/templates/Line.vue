<template>
  <div>
    <colour-picker :value.sync="lineColour" />
    <size-picker :value.sync="lineSize"></size-picker>
    <v-radio-group v-model="lineEndStyle" row>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-arrow-right" off-icon="fa-arrow-right" :value="'arrow'"></v-radio>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-slash" off-icon="fa-slash" :value="'line'"></v-radio>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-ruler-combined" off-icon="fa-ruler-combined" :value="'tBar'"></v-radio>
      <v-spacer></v-spacer>
    </v-radio-group>
    <v-radio-group v-model="lineStrokeStyle" row>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-minus" off-icon="fa-minus" :value="0"></v-radio>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-ellipsis-h" off-icon="fa-ellipsis-h" :value="1"></v-radio>
      <v-spacer></v-spacer>
    </v-radio-group>
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-switch
          v-model="lineTemporary"
          :label="lineTemporary ? 'Temporary' : 'Permanent'"
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
  name: 'StraightLine',
  computed: {},
  components: { SizePicker, ColourPicker }
})
export default class PopoutButton extends Vue {
  @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => Tool
  @Tools.Action(ToolsAction.SET_COLOUR) setColour!: (colour: string) => void
  @Tools.Action(ToolsAction.SET_SIZE) setSize!: (size: number) => void
  @Tools.Action(ToolsAction.SET_END_STYLE) setEndStyle!: (endStyle: string) => void
  @Tools.Action(ToolsAction.SET_STROKE_STYLE) setStrokeStyle!: (strokeStyle: number) => void
  @Tools.Action(ToolsAction.SET_TEMPORARY) setTemporary!: (temporary: boolean) => void

  get lineSize () {
    return this.findTool('line').size || 3
  }

  set lineSize (newValue: number) {
    this.setSize(newValue)
  }

  set lineColour (newValue: string) {
    this.setColour(newValue)
  }

  get lineColour (): string {
    return this.findTool('line').colour || '#FF0000FF'
  }

  get lineEndStyle (): string {
    return this.findTool('line').endStyle || 'line'
  }

  set lineEndStyle (newValue: string) {
    this.setEndStyle(newValue)
  }

  get lineStrokeStyle (): number {
    return this.findTool('line').strokeStyle || 0
  }

  set lineStrokeStyle (newValue: number) {
    this.setStrokeStyle(newValue)
  }

  get lineTemporary (): boolean {
    return this.findTool('line').temporary || false
  }

  set lineTemporary (newValue: boolean) {
    this.setTemporary(newValue)
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
