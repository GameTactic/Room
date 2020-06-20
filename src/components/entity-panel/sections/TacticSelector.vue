<template>
  <accordion-item>
    <template v-slot:header>
      Tactics
    </template>
    <template v-slot:rightBtn>
      <v-btn
        text
        light
        icon
        class="custom-add-button ml-3"
        @click.stop="newTacticOnClickHandler"
      >
        <v-icon
          color="white"
          size="20px"
        >
          fa-plus
        </v-icon>
      </v-btn>
    </template>
    <template v-slot:content>
      <tactic-selector-content></tactic-selector-content>
    </template>
  </accordion-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import AccordionItem from '@/components/entity-panel/templates/AccordionItem.vue'
import TacticSelectorContent from '@/components/entity-panel/sections/components/tacticSelector/TacticSelectorContent.vue'
import { EventBus } from '@/event-bus'

@Component({
  name: 'TacticSelector',
  components: {
    TacticSelectorContent,
    AccordionItem
  }
})
export default class TacticSelector extends Vue {
  newTacticOnClickHandler () {
    EventBus.$emit('openCreateNewTacticOverlay')
  }
}
</script>

<style lang="scss" scoped>
</style>
