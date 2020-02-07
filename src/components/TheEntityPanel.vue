<template>
  <v-sheet
    class="the-entity-panel-sheet"
    :elevation="5"
  >
    Entity Settings go here!
  </v-sheet>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'TheEntityPanel'
})
export default class MapButtons extends Vue {
  @Prop() private id!: string;
}
</script>
<style scoped lang="scss">
.the-entity-panel-sheet {
  right: 0.25rem;
  margin: 0.25rem;
  height: 75%;
  position: fixed;
}
</style>
