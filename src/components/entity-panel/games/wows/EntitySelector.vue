<template>
  <accordion-item>
    <template v-slot:header>
      Ships
    </template>
    <template v-slot:content>
      <entity-selector-content></entity-selector-content>
    </template>
  </accordion-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import AccordionItem from '@/components/entity-panel/templates/AccordionItem.vue'
import EntitySelectorContent from '@/components/entity-panel/games/wows/components/EntitySelectorContent.vue'

@Component({
  name: 'EntitySelector',
  components: {
    EntitySelectorContent,
    AccordionItem
  }
})
export default class EntitySelector extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
