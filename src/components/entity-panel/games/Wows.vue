<template>
  <div v-if="clickedItemKey === 0">
    <TheCreateEntity
      game="wows"
      :entities.sync="entities"
      :clickedItemKey="clickedItemKey"
      :teams="teams"
      :entityData="shipsData"
      :fields="fields"
      :autoCompleteOnChangeHandler="autoCompleteOnChangeHandler"
    />
  </div>
  <div
    v-else
  >
    _
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { Component, Prop, Vue } from 'vue-property-decorator'
import { RoomGetters, RoomState, Ship } from '@/store/modules/room'
import { Getter } from 'vuex-class'
import { MenuItem } from '@/components/TheEntityPanel.vue'
import { Field } from '@/types/Games/Index.ts'
import { Item } from '@/types/Games/Index'
import TheCreateEntity from '@/components/entity-panel/sections/TheCreateEntity.vue'

@Component({
  name: 'WOWS',
  components: {
    TheCreateEntity
  }
})
export default class Wows extends Vue {
  @Prop() private clickedItemKey!: number;
  @Prop() private teams!: MenuItem[];
  @Getter(`room/${RoomGetters.ROOM_STATE}`) roomState!: RoomState;

  entities: Item[] = []

  fields: Field[] = [{
    id: 'shipMainBatteryRange',
    path: 'artillery.distance',
    value: '',
    hide: false,
    label: 'entity.wows.artillery.label',
    placeholder: 'entity.wows.artillery.placeholder',
    suffix: 'entity.wows.artillery.suffix'
  }, {
    id: 'shipSurfaceConcealment',
    path: 'concealment.detect_distance_by_ship',
    value: '',
    hide: false,
    label: 'entity.wows.surfaceConcealment.label',
    placeholder: 'entity.wows.surfaceConcealment.placeholder',
    suffix: 'entity.wows.surfaceConcealment.suffix'
  }, {
    id: 'shipPlaneConcealment',
    path: 'concealment.detect_distance_by_plane',
    value: '',
    hide: false,
    label: 'entity.wows.planeConcealment.label',
    placeholder: 'entity.wows.planeConcealment.placeholder',
    suffix: 'entity.wows.planeConcealment.suffix'
  }, {
    id: 'shipTorpedoesRange',
    path: 'torpedoes.distance',
    value: '',
    hide: false,
    label: 'entity.wows.torpedoRange.label',
    placeholder: 'entity.wows.torpedoRange.placeholder',
    suffix: 'entity.wows.torpedoRange.suffix'
  }, {
    id: 'shipRadarRange',
    path: '',
    value: '',
    hide: false,
    label: 'entity.wows.radarRange.label',
    placeholder: 'entity.wows.radarRange.placeholder',
    suffix: 'entity.wows.radarRange.suffix'
  }, {
    id: 'shipHydroRange',
    path: '',
    value: '',
    hide: false,
    label: 'entity.wows.hydroRange.label',
    placeholder: 'entity.wows.hydroRange.placeholder',
    suffix: 'entity.wows.hydroRange.suffix'
  }]

  get shipsData (): Item[] {
    const roomStateGameInfo = this.roomState.game.gameInfo
    if (roomStateGameInfo) {
      if (this.roomState.game?.ships) {
        return [{
          text: 'Aircraft Carrier (CV)',
          shortText: 'CV',
          value: 1,
          image: 'https://glossary-wows-global.gcdn.co/icons/vehicle/types/AirCarrier/standard_84f55678325d4b492215390a7f0b43008f3947ab201502cd979dcf4c37633cf3.png',
          tier: 0,
          data: {}
        }, {
          text: 'Battleship (BB)',
          shortText: 'BB',
          value: 2,
          image: 'https://glossary-wows-global.gcdn.co/icons/vehicle/types/Battleship/standard_01624cacb82f39f77a4e677a7b9fdf4df20dafd61f971f4b2d3e54c3065e2892.png',
          tier: 0,
          data: {}
        }, {
          text: 'Cruiser (CA)',
          shortText: 'CA',
          value: 3,
          image: 'https://glossary-wows-global.gcdn.co/icons/vehicle/types/Cruiser/standard_874a3bdc3134b8da4fd6f52186f1b2b682f13ef78688732d3016785c0649a424.png',
          tier: 0,
          data: {}
        }, {
          text: 'Destroyer (DD)',
          shortText: 'DD',
          value: 4,
          image: 'https://glossary-wows-global.gcdn.co/icons/vehicle/types/Destroyer/standard_357acc9fc0e2f7d98f047c99edffad359a8c45f2093024400fef2b9abbaf3a59.png',
          tier: 0,
          data: {}
        }, ...this.roomState.game?.ships.map((ship: Ship) => ({
          text: `${ship.name} (${ship.tier})`,
          shortText: ship.name,
          value: ship.ship_id,
          image: roomStateGameInfo.ship_type_images[ship.type][ship.is_special ? 'image_elite' : ship.is_premium ? 'image_premium' : 'image'],
          tier: ship.tier,
          data: {}
        })).sort((x: Item, y: Item) => x.text > y.text ? 1 : -1)]
      }
    }
    return []
  }

  async autoCompleteOnChangeHandler (shipItem: Item) {
    if (shipItem && !this.entities.find((entity: Item) => entity.value === shipItem.value)) {
      this.entities.unshift(shipItem)
      const response = await axios.get(`https://api.worldofwarships.eu/wows/encyclopedia/shipprofile/?ship_id=${shipItem.value}&application_id=d84a218b4fec37003e799f13777bf880`)
      const shipData = response.data.data[shipItem.value]
      const foundNewEntity = this.entities.find((entity: Item) => entity.value === shipItem.value)
      if (foundNewEntity) {
        foundNewEntity.data = shipData
      }
    }
  }
}
</script>
<style lang="scss">
</style>
