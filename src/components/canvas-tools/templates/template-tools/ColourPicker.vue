<template>
  <v-color-picker
    :value="value"
    :swatches="swatches"
    mode="hexa"
    show-swatches
    hide-canvas
    class="color-picker-border"
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
    ['#CE0000FF', '#40476DFF'],
    ['#D74E09FF', '#792387FF'],
    ['#F2BB05FF', '#3349F4FF'],
    ['#08A045FF', '#4392F1FF'],
    ['#F7FFF7FF', '#080F0FFF']
  ];

  onColourPickerHandler (colour: string) {
    this.$emit('update:value', colour)
  }
}
</script>

<style lang="scss">
.v-color-picker__controls {
  display: none;
}
.color-picker-border .v-color-picker__color div {
  border: 1px solid #6D6D6D4D !important;
  border-radius: 2px;
}
</style>
