<template>
  <div>
    <v-btn-toggle>
      <v-btn
        tile
        dense
        icon
        small
        title="Zoom out"
      >
        <v-icon>fa-plus</v-icon>
      </v-btn>
      <small
        class="custom-zoom-percentage-button"
      >
        {{ zoomPercentage }}%
      </small>
      <v-btn
        tile
        dense
        icon
        small
        title="Zoom in"
      >
        <v-icon>fa-minus</v-icon>
      </v-btn>
      <v-autocomplete
        :items="[]"
        :search-input.sync="search"
        class="body-1"
        color="primary"
        hide-no-data
        hide-selected
        label="Search for your map"
        placeholder="Start typing to Search"
        autocomplete="new-password"
        return-object
      >
        <template v-slot>
          <!-- <v-list-item-avatar size="29" class="custom-list-item-avatar">
            <img :src="data.item.image">
          </v-list-item-avatar> -->
          <v-list-item-content class="custom-list-item-content">
            <v-list-item-title>Text</v-list-item-title>
          </v-list-item-content>
        </template>
      </v-autocomplete>
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
  background-color: #f5f5f5;
  border-right: 1px solid grey;
  border-bottom: 1px solid grey;
  border-color: rgba(0, 0, 0, 0.12);
  padding-right: 0.25rem;
  padding-left: 0.25rem;
}
</style>
