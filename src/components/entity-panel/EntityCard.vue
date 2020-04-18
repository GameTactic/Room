<template>
  <v-card
    class="custom-entity-card"
    :data-tier="entity.tier"
    :data-type="entity.type"
    :data-image="entity.image"
    raised
    tile
    draggable
    @mouseover="entityCardOnMouseHoverHandler(entity.value)"
  >
    <v-container class="pa-1">
      <v-row class="text-center mx-0">
        <v-col cols="12" class="pa-0">
          <img class="custom-entity-card-image" :src="entity.image">
        </v-col>
        <v-col cols="12" class="pa-0">
          <div class="caption">{{entity.shortText}}</div>
          <v-chip v-if="entity.tier" x-small pill>T-{{entity.tier}}</v-chip>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { Item } from '@/types/Games/Index'

@Component({
  name: 'EntityCard'
})
export default class EntityCard extends Vue {
  @Prop() private entityCardOnMouseHoverHandler!: (cardValue: number) => void
  @Prop() private entity!: Item;
}
</script>
<style lang="scss" scoped>
.custom-entity-card {
  min-width: 90px;
  min-height: 90px;
  display: flex;
  align-items: center;
}

.custom-entity-card-image {
  background-color: $room-primary;
  border-radius: 50%;
  filter: opacity(0.75);
}
</style>
