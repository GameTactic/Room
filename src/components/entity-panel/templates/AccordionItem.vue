<template>
  <v-expansion-panel>
    <v-expansion-panel-header
      class="custom-expansion-panel-header px-3 py-0"
      color="white--text"
      hide-actions
    >
      <template v-slot:default="{ open: boolean }">
        <v-icon
          :class="['custom-caret', (boolean) ? 'custom-caret-on' : '']"
          color="white"
          size="15px"
        >
          fa-chevron-down
        </v-icon>
        <span class="pl-3"><slot name="header">Header</slot></span>
        <slot name="middleSpace"></slot>
        <v-divider vertical v-if="$slots.rightBtn"></v-divider>
        <slot name="rightBtn" class="custom-add-button ml-3"></slot>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="custom-expansion-panel-content">
      <slot name="content"></slot>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'

@Component({
  name: 'AccordionItem'
})
export default class AccordionItem extends Vue {
}
</script>

<style lang="scss">
.custom-expansion-panel-active {
  background: $room-primary;
  .v-expansion-panel-header__icon .v-icon {
    color: white !important;
    font-size: 15px;
  }
}
.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 48px !important;
}
.custom-expansion-panel-content .v-expansion-panel-content__wrap {
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.custom-caret {
  flex: unset;
}
.custom-caret-on {
  transform: rotate(180deg);
}
.custom-rotate {
  transform: rotate(90deg);
}
</style>
<style lang="scss">
.custom-add-button {
  border-radius: 4px !important;
  max-width: 40px;
}
</style>
