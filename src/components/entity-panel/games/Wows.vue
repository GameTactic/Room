<template>
  <div v-if="clickedItem === 'Add'">
    <TheCreateEntity :clickedItem="clickedItem" :teams="teams" :shipsData="shipsData"/>
  </div>
  <div
    v-else
  >
    Other content
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RoomGetters, RoomState, Ship } from '@/store/modules/room'
import { Getter } from 'vuex-class'
import { MenuItem } from '../../TheEntityPanel.vue'
import { SavedField } from '@/types/Games'
import { ShipField, ShipItem } from '@/types/Games/Wows'
import TheCreateEntity from '../sections/TheCreateEntity.vue'

@Component({
  name: 'WOWS',
  components: {
    TheCreateEntity
  }
})
export default class Wows extends Vue {
  @Prop() private clickedItem!: string;
  @Prop() private teams!: MenuItem[];
  @Getter(`room/${RoomGetters.ROOM_STATE}`) roomState!: RoomState;

  get shipsData (): ShipItem[] {
    const entityPlaceholders: ShipItem[] = [{
      text: 'Aircraft Carrier (CV)',
      value: 1,
      image: this.roomState.game.gameInfo?.ship_type_images.AirCarrier.image,
      tier: 0
    }, {
      text: 'Battleship (BB)',
      value: 2,
      image: this.roomState.game.gameInfo?.ship_type_images.Battleship.image,
      tier: 0
    }, {
      text: 'Cruiser (CA)',
      value: 3,
      image: this.roomState.game.gameInfo?.ship_type_images.Cruiser.image,
      tier: 0
    }, {
      text: 'Destroyer (DD)',
      value: 4,
      image: this.roomState.game.gameInfo?.ship_type_images.Destroyer.image,
      tier: 0
    }]
    if (this.roomState?.game?.ships) {
      return [...entityPlaceholders, ...this.roomState?.game?.ships.map((ship: Ship) => ({
        text: `${ship.name} (${ship.tier})`,
        value: ship.ship_id,
        image: this.roomState.game.gameInfo ? this.roomState.game.gameInfo.ship_type_images[ship.type][ship.is_special ? 'image_elite' : ship.is_premium ? 'image_premium' : 'image'] : undefined,
        tier: ship.tier
      })).sort((x: ShipItem, y: ShipItem) => x.text > y.text ? 1 : -1)]
    }
    return [...entityPlaceholders]
  }
}
</script>
<style lang="scss">
</style>
