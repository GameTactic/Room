<template>
<v-slider
  :value="value"
  :hint="'Size: ' + value"
  prepend-icon="fa-ruler-vertical"
  :max="6"
  :step="1"
  ticks="always"
  @input="onColourPickerHandler"
/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'SizePicker',
  props: ['value']
})

export default class SizePicker extends Vue {
  onColourPickerHandler (size: number) {
    this.$emit('update:value', size)
  }
}
</script>

<style scoped lang="scss">
.v-color-picker__controls {
  display: none;
}
</style>
