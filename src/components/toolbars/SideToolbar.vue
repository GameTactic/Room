<template>
    <v-btn-toggle class="flex-column side-toolbar">
      <slot/>
    </v-btn-toggle>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

  @Component({
    name: 'side-toolbar'
  })
export default class SideToolbar extends Vue {
}
</script>

<style scoped lang="scss">
.side-toolbar {
  padding: 0.5ch;
  margin: 1ch;
}
</style>
