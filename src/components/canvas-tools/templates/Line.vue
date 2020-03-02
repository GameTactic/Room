<template>
  <div>
    <v-color-picker
      v-model="lineColour"
      :swatches="swatches"
      mode="hexa"
      show-swatches
      hide-canvas
      flat
      hide-inputs
      hide-mode-switch
    />
    <v-slider
      prepend-icon="fa-ruler-vertical"
      :hint="lineSizeHint"
      v-model="lineSize"
      :max="6"
      :step="1"
      ticks="always"
    />
    <v-radio-group v-model="lineEndStyle" row>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-arrow-right" off-icon="fa-arrow-right" :value="'arrow'"></v-radio>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-slash" off-icon="fa-slash" :value="'line'"></v-radio>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-ruler-combined" off-icon="fa-ruler-combined" :value="'T'"></v-radio>
      <v-spacer></v-spacer>
    </v-radio-group>
    <v-radio-group v-model="lineStrokeStyle" row>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-minus" off-icon="fa-minus" :value="0"></v-radio>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-ellipsis-h" off-icon="fa-ellipsis-h" :value="1"></v-radio>
      <v-spacer></v-spacer>
      <v-radio class="mr-0" name="endStyle" on-icon="fa-ruler" off-icon="fa-ruler" :value="2"></v-radio>
      <v-spacer></v-spacer>
    </v-radio-group>
    <v-container>
      <v-row>
        <v-spacer></v-spacer>
        <v-switch
          v-model="lineTemporarily"
          :label="lineTemporarily === true ? 'Temporarily' : 'Permanent'"
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

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'StraightLine',
  computed: {}
})
export default class PopoutButton extends Vue {
  @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => Tool
  @Tools.Action(ToolsAction.SET_COLOUR) setColour!: (colour: string) => void
  @Tools.Action(ToolsAction.SET_SIZE) setSize!: (size: number) => void
  @Tools.Action(ToolsAction.SET_ENDSTYLE) setEndStyle!: (endStyle: string) => void
  @Tools.Action(ToolsAction.SET_STROKESTYLE) setStrokeStyle!: (strokeStyle: number) => void
  @Tools.Action(ToolsAction.SET_TEMPORARILY) setTemporarily!: (temporarily: boolean) => void
  swatches = [
    ['#FF0000', '#AA0000', '#550000'],
    ['#FFFF00', '#AAAA00', '#555500'],
    ['#00FF00', '#00AA00', '#005500'],
    ['#00FFFF', '#00AAAA', '#005555'],
    ['#0000FF', '#0000AA', '#000055']
  ];

  get lineSizeHint (): string {
    return `Size: ${this.lineSize}`
  }

  get lineSize () {
    return this.findTool('line').size || 2
  }

  set lineSize (newValue: number) {
    this.setSize(newValue)
  }

  set lineColour (newValue: string) {
    this.setColour(newValue)
  }

  get lineColour (): string {
    return this.findTool('line').colour || '#FF0000'
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

  get lineTemporarily (): boolean {
    return this.findTool('line').temporarily || false
  }

  set lineTemporarily (newValue: boolean) {
    this.setTemporarily(newValue)
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
