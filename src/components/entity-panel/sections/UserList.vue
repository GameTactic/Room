<template>
  <accordion-item>
    <template v-slot:header>
      Users [0]
    </template>
    <template v-slot:rightBtn>
      <v-btn
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
          fa-user-plus
        </v-icon>
      </v-btn>
    </template>
    <template v-slot:content>
      User list content
    </template>
  </accordion-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import AccordionItem from '@/components/entity-panel/templates/AccordionItem.vue'

@Component({
  name: 'UserList',
  components: {
    AccordionItem
  }
})
export default class UserList extends Vue {
}
</script>

<style lang="scss" scoped>
</style>
