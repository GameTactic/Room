<template>
  <v-card>
    <v-card-subtitle class="pb-0 pl-5">
      Colour
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <colour-picker :value.sync="lineColour" />
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5">
      Size
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <size-picker class="px-2" :value.sync="lineSize"></size-picker>
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5">
      End style
    </v-card-subtitle>
    <v-card-actions class="pb-0">
      <v-radio-group v-model="lineEndStyle" row class="mt-1 px-3 flex-fill">
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-radio v-on="on" class="mr-0" name="endStyle" on-icon="fa-arrow-right" off-icon="fa-arrow-right" :value="'arrow'"></v-radio>
          </template>
          <span>Arrow</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-radio v-on="on" class="mr-0" name="endStyle" on-icon="fa-slash" off-icon="fa-slash" :value="'line'"></v-radio>
          </template>
          <span>Line</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-radio v-on="on" class="mr-0" name="endStyle" on-icon="fa-ruler-combined" off-icon="fa-ruler-combined" :value="'tBar'"></v-radio>
          </template>
          <span>T Bar</span>
        </v-tooltip>
        <v-spacer></v-spacer>
      </v-radio-group>
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5">
      Stroke style
    </v-card-subtitle>
    <v-card-actions class="pb-0">
      <v-radio-group v-model="lineStrokeStyle" row class="mt-1 px-3 flex-fill">
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
          v-model="lineTemporary"
          class="mt-0"
          :label="lineTemporary ? 'Temporary' : 'Permanent'"
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
