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
import { Component, Prop, Vue } from 'vue-property-decorator'
import { ITool } from '../../../types/canvas'

@Component({
  name: 'Freedraw',
  computed: {
    penSizeHint () : string {
      return `Size: ${this.$store.getters.tool('freedraw', 'size')}`
    },
    penSize: {
      get () {
        return this.$store.getters.tool('freedraw', 'size')
      },
      set (newValue: string) {
        this.$store.dispatch('setTool', { name: 'freedraw', size: newValue })
      }
    },
    penColour: {
      get () {
        return this.$store.getters.tool('freedraw', 'colour')
      },
      set (newValue) {
        let colour = newValue
        if (newValue.hexa) {
          colour = newValue.hexa
        }
        this.$store.dispatch('setTool', { name: 'freedraw', colour })
      }
    }
  }
})
export default class PopoutButton extends Vue {
  swatches = [
    ['#FF0000', '#AA0000', '#550000'],
    ['#FFFF00', '#AAAA00', '#555500'],
    ['#00FF00', '#00AA00', '#005500'],
    ['#00FFFF', '#00AAAA', '#005555'],
    ['#0000FF', '#0000AA', '#000055']
  ]
}

</script>
<style scoped lang="scss">

</style>
<style lang="scss">
.v-color-picker__controls {
  display: none;
}
</style>
