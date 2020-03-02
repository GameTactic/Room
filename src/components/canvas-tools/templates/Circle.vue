<template>
  <div>
    <p>Outline colour</p>
    <v-color-picker
      v-model="circleColour"
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
      :hint="circleSizeHint"
      v-model="circleSize"
      :max="6"
      :step="1"
      ticks="always"
    />
    <p>Fill colour</p>
    <v-color-picker
      v-model="circleOutlineColour"
      :swatches="swatches"
      mode="hexa"
      show-swatches
      hide-canvas
      flat
      hide-inputs
      hide-mode-switch
    />
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
          v-model="circleTemporarily"
          :label="circleTemporarily === true ? 'Temporarily' : 'Permanent'"
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

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'DrawCircle',
  computed: {}
})
export default class PopoutButton extends Vue {
  @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => Tool
  @Tools.Action(ToolsAction.SET_COLOUR) setColour!: (colour: string) => void
  @Tools.Action(ToolsAction.SET_SIZE) setSize!: (size: number) => void
  @Tools.Action(ToolsAction.SET_SHOWRADIUS) setShowRadius!: (showRadius: boolean) => void
  @Tools.Action(ToolsAction.SET_OUTLINECOLOUR) setOutlineColour!: (outlineColour: string) => void
  @Tools.Action(ToolsAction.SET_TEMPORARILY) setTemporarily!: (temporarily: boolean) => void
  @Tools.Action(ToolsAction.SET_STROKESTYLE) setStrokeStyle!: (strokeStyle: number) => void
  swatches = [
    ['#FF0000', '#AA0000', '#550000'],
    ['#FFFF00', '#AAAA00', '#555500'],
    ['#00FF00', '#00AA00', '#005500'],
    ['#00FFFF', '#00AAAA', '#005555'],
    ['#0000FF', '#0000AA', '#000055']
  ];
  swatchesFill = [
    ['#FF000066', '#AA000066', '#55000066'],
    ['#FFFF0066', '#AAAA0066', '#55550066'],
    ['#00FF0066', '#00AA0066', '#00550066'],
    ['#00FFFF66', '#00AAAA66', '#00555566'],
    ['#0000FF66', '#0000AA66', '#00005566']
  ];

  get circleSizeHint (): string {
    return `Size: ${this.circleSize}`
  }

  get circleSize () {
    return this.findTool('circle').size || 2
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

  get circleTemporarily (): boolean {
    return this.findTool('circle').temporarily || false
  }

  set circleTemporarily (newValue: boolean) {
    this.setTemporarily(newValue)
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
<style lang="scss">
.v-color-picker__controls {
  display: none;
}
</style>
