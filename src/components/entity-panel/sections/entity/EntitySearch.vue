<template>
  <v-text-field
    :value="value"
    class="custom-entity-search px-2 py-0"
    :placeholder="$t(placeholder)"
    dense
    prepend-icon="fa-search"
    clear-icon="fa-times"
    clearable
    autocomplete="new-password"
    @input="$emit('input', $event)"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component({
  name: 'EntitySearch'
})
export default class EntitySearch extends Vue {
  @Prop() placeholder!: string
  @Prop() value!: string
}
</script>
<style lang="scss">
.custom-entity-search .v-text-field__details {
  display: none;
}
</style>
