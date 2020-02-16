<template>
  <div>
    <v-color-picker
      v-model="penColour"
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
      :hint="penSizeHint"
      v-model="penSize"
      :max="6"
      :step="1"
      ticks="always"
    />
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
    name: 'Freedraw',
    computed: {}
  })
export default class PopoutButton extends Vue {
    @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => Tool
    @Tools.Action(ToolsAction.SET_COLOUR) setColour!: (colour: string) => void
    @Tools.Action(ToolsAction.SET_SIZE) setSize!: (size: number) => void
    swatches = [
      ['#FF0000', '#AA0000', '#550000'],
      ['#FFFF00', '#AAAA00', '#555500'],
      ['#00FF00', '#00AA00', '#005500'],
      ['#00FFFF', '#00AAAA', '#005555'],
      ['#0000FF', '#0000AA', '#000055']
    ]

    get penSizeHint (): string {
      return `Size: ${this.penSize}`
    }

    get penSize () {
      return this.findTool('freedraw').size
    }

    set penSize (newValue: number) {
      this.setSize(newValue)
    }

    get penColour (): string {
      return this.findTool('freedraw').colour
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
