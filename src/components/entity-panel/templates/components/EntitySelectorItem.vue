<template>
  <v-chip
    small
    label
    :color="entity.color || 'blue'"
    class="px-2"
  >
    <v-avatar>
      <img :src="entity.image">
    </v-avatar>
    <span class="white--text">{{ entity.name }}</span>
  </v-chip>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Entity } from '@/store/types'

@Component({
  name: 'EntitySelectorItem'
})
export default class EntitySelectorItem extends Vue {
  @Prop() private entity!: Entity
}
</script>

<style scoped>

</style>
