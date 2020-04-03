<template>
  <div class="custom-canvas-tools-container">
    <v-btn-toggle dense group>
      <v-btn
        tile
        icon
        color="primary"
        max-height="40"
        title="Zoom in"
      >
        <v-icon small>fa-plus</v-icon>
      </v-btn>
      <small
        class="custom-zoom-percentage-button"
      >
        {{ zoomPercentage }}%
      </small>
      <v-btn
        tile
        icon
        color="primary"
        max-height="40"
        title="Zoom out"
      >
        <v-icon small>fa-minus</v-icon>
      </v-btn>
    </v-btn-toggle>
    <v-divider vertical />
    <v-btn-toggle dense group>
      <v-btn
        tile
        icon
        color="primary"
        max-height="40"
        title="Move canvas"
      >
        <v-icon small>fa-hand-paper</v-icon>
      </v-btn>
      <v-btn
        tile
        icon
        color="primary"
        max-height="40"
        title="Center the canvas"
      >
        <v-icon small>fa-border-all</v-icon>
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'TheCanvasTools'
})
export default class TheCanvasTools extends Vue {
  zoomPercentage = 100
  search = ''
}

</script>
<style scoped lang="scss">
.custom-zoom-percentage-button {
  display: flex;
  align-items: center;
  padding-right: 0.25rem;
  padding-left: 0.25rem;
}

.custom-canvas-tools-container {
  display: flex;
  border: 1px solid rgba(0, 0, 0, 0.12);
}

</style>
