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
    ['#CE0000FF', '#D74E09FF'],
    ['#F2BB05FF', '#08A045FF'],
    ['#4392F1FF', '#3349F4FF'],
    ['#40476DFF', '#792387FF'],
    ['#F7FFF7FF', '#080F0FFF']
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
.v-color-picker__color > div {
  border: 1px solid #6D6D6D4D !important;
}
</style>
