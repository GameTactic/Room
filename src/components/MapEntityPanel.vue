<template>
  <v-sheet
    class="entity-panel-container"
    :elevation="5"
  >
    Entity Settings go here!
  </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'MapEntityButtons'
})
export default class MapButtons extends Vue {
  @Prop() private id!: string;
}
</script>
<style scoped lang="scss">
.entity-panel-container {
  right: 0.25rem;
  margin: 0.25rem;
  height: 75%;
  position: fixed;
}
</style>
