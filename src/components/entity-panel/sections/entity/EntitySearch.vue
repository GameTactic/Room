<template>
  <v-text-field
    :value="value"
    :placeholder="$t(placeholder, { entity: this.entityName })"
    class="custom-entity-search px-2 py-0"
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
import { getEntityName } from '@/games/utils'
import { Game } from '@/store/types'

@Component({
  name: 'EntitySearch'
})
export default class EntitySearch extends Vue {
  @Prop() placeholder!: string
  @Prop() value!: string
  @Prop() game!: Game

  getEntityName = getEntityName
  entityName: string = this.getEntityName(this.game)
}
</script>
<style lang="scss">
.custom-entity-search .v-text-field__details {
  display: none;
}
</style>
