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
  name: 'ColourPickerTransparency',
  props: ['value']
})

export default class ColourPickerTransparency extends Vue {
  swatches = [
    ['#CE000080', '#40476D80'],
    ['#D74E0980', '#79238780'],
    ['#F2BB0580', '#3349F480'],
    ['#08A04580', '#4392F180'],
    ['#F7FFF780', '#66666680']
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
</style>
