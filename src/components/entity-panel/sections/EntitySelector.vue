<template>
  <accordion-item>
    <template v-slot:header>
      Ships
    </template>
    <template v-slot:rightBtn>
      <v-tooltip left>
        <template v-slot:activator="{ on }">
          <v-btn
            v-on="on"
            text
            light
            icon
            class="custom-add-button ml-3"
            @click.stop=""
          >
            <v-icon
              color="white"
              size="20px"
            >
              fa-upload
            </v-icon>
          </v-btn>
        </template>
        <span>Comming soon!</span>
      </v-tooltip>
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
import EntitySelectorContent from '@/components/entity-panel/games/wows/components/WowsEntitySelectorContent.vue'

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
