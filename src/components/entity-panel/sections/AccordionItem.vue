<template>
  <v-expansion-panel class="custom-expansion-panel">
    <v-expansion-panel-header
      class="custom-expansion-panel-header pl-3 pr-0 py-0"
      hide-actions
    >
      <template v-slot:default="{ open: boolean }">
        <v-icon
          :class="['custom-caret', (boolean) ? 'custom-caret-on' : '']"
          color="white"
          small
        >
          fa-chevron-down
        </v-icon>
        <span class="pl-3">
          <slot name="header">Header</slot>
        </span>
        <slot name="middleSpace"></slot>
        <v-divider v-if="icon" vertical />
          <v-btn
            icon
            class="custom-button"
            @click.stop="$emit('rightButtonClicked')"
          >
            <v-icon color="white" small>
              {{ icon }}
            </v-icon>
          </v-btn>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content class="custom-expansion-panel-content">
      <slot name="content" />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'

@Component({
  name: 'AccordionItem'
})
export default class AccordionItem extends Vue {
  @Prop() private readonly icon!: string
}
</script>
<style lang="scss" scoped>
.custom-button {
  max-width: 50px;
  justify-content: center;
}

.custom-expansion-panel {
  border-left: 0.85px solid rgba(0, 0, 0, 0.12);
}

.custom-expansion-panel-header {
  border: 1px solid rgba(0, 0, 0, 0.12);
  background: $room-primary;
  height: 35px !important;
  min-height: 35px !important;
  color: white;
}

.custom-caret {
  flex: unset;
  transform: rotate(-90deg);
}

.custom-caret-on {
  transform: rotate(0deg);
}
</style>
<style lang="scss">
.custom-expansion-panel-content > div {
  padding: 0 !important;
  max-height: 420px;
  overflow-y: auto;
  overflow-x: hidden;
  margin-right: 4px;
  @include custom-scroll-bar;
}

.v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 48px !important;
}
</style>
