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
  name: 'ColourPickerTransparency',
  props: ['value']
})

export default class ColourPickerTransparency extends Vue {
  swatches = [
    ['#FF000080', '#AA000080', '#55000080'],
    ['#FFFF0080', '#AAAA0080', '#55550080'],
    ['#00FF0080', '#00AA0080', '#00550080'],
    ['#00FFFF80', '#00AAAA80', '#00555580'],
    ['#0000FF80', '#0000AA80', '#00005580']
  ];

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
