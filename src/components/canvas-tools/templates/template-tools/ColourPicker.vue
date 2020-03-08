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
    ['#FF0000FF', '#AA0000FF', '#550000FF'],
    ['#FFFF00FF', '#AAAA00FF', '#555500FF'],
    ['#00FF00FF', '#00AA00FF', '#005500FF'],
    ['#00FFFFFF', '#00AAAAFF', '#005555FF'],
    ['#0000FFFF', '#0000AAFF', '#000055FF']
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
