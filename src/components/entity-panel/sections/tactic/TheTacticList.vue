<template>
  <accordion-item icon="fa-plus" @rightButtonClicked="newTacticOnClickHandler">
    <template v-slot:header>
      Tactics
    </template>
    <template v-slot:content>
      <the-tactic-list-content />
    </template>
  </accordion-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { EventBus } from '@/event-bus'
import AccordionItem from '../AccordionItem.vue'
import TheTacticListContent from './TheTacticListContent.vue'

@Component({
  name: 'TheTacticList',
  components: {
    TheTacticListContent,
    AccordionItem
  }
})
export default class TheTacticList extends Vue {
  newTacticOnClickHandler () {
    EventBus.$emit('openCreateNewTacticOverlay')
  }
}
</script>

<style lang="scss" scoped>
</style>
