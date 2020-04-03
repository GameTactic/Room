<template>
  <div class="custom-canvas-tools-container">
    <v-btn-toggle dense group>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            v-on="on"
            color="primary"
            max-height="40"
          >
            <v-icon small>fa-plus</v-icon>
          </v-btn>
        </template>
        <span>Zoom in</span>
      </v-tooltip>
      <small
        class="custom-zoom-percentage-button"
      >
        {{ zoomPercentage }}%
      </small>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            v-on="on"
            color="primary"
            max-height="40"
          >
            <v-icon small>fa-minus</v-icon>
          </v-btn>
        </template>
        <span>Zoom out</span>
      </v-tooltip>
    </v-btn-toggle>
    <v-divider vertical />
    <v-btn-toggle dense group>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            v-on="on"
            color="primary"
            max-height="40"
          >
            <v-icon small>fa-hand-paper</v-icon>
          </v-btn>
        </template>
        <span>Move canvas</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            tile
            icon
            v-on="on"
            color="primary"
            max-height="40"
          >
            <v-icon small>fa-border-all</v-icon>
          </v-btn>
        </template>
        <span>Center the canvas</span>
      </v-tooltip>
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
