<template>
<v-slider
  :value="value"
  :hint="`${$t('tool.template.size')}: ${value}`"
  prepend-icon="fa-ruler-vertical"
  persistent-hint
  :max="6"
  :min="1"
  :step="1"
  ticks="always"
  @input="onSizePickerHandler"
/>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'SizePicker',
  props: ['value']
})

export default class SizePicker extends Vue {
  onSizePickerHandler (size: number) {
    this.$emit('update:value', size)
  }
}
</script>

<style scoped lang="scss">
.v-color-picker__controls {
  display: none;
}
</style>
