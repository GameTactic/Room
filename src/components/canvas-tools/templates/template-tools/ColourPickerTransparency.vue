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
    ['#CE000080', '#D74E0980'],
    ['#F2BB0580', '#08A04580'],
    ['#4392F180', '#3349F480'],
    ['#40476D80', '#79238780'],
    ['#F7FFF780', '#080F0F80']
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
