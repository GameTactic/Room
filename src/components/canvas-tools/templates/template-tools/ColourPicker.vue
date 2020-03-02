<template>
  <v-color-picker
    :value="value"
    :swatches="swatches"
    mode="hexa"
    show-swatches
    hide-canvas
    flat
    hide-inputs
    hide-mode-switch
    @input="onColourPickerHandler"
  />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'ColourPicker',
  props: ['value']
})

export default class ColourPicker extends Vue {
  swatches = [
    ['#FF0000', '#AA0000', '#550000'],
    ['#FFFF00', '#AAAA00', '#555500'],
    ['#00FF00', '#00AA00', '#005500'],
    ['#00FFFF', '#00AAAA', '#005555'],
    ['#0000FF', '#0000AA', '#000055']
  ];

  vi = this

  element = (e: object) => {
    return e
  }

  onColourPickerHandler (colour: string) {
    this.$emit('update:value', colour)
  }
}
</script>

<style scoped lang="scss">
.v-color-picker__controls {
  display: none;
}
</style>
