<template>
  <div v-if="clickedItem === 'Add'">
    <v-autocomplete
      :items="shipsData"
      :search-input.sync="search"
      class="body-1 custom-autocomplete"
      color="primary"
      hide-no-data
      hide-selected
      label="Search for your ship"
      placeholder="Start typing to Search"
      prepend-icon="fa-search"
      autocomplete="new-password"
      return-object
      @change="autoCompleteOnChangeHandler"
    >
      <template v-slot:item="data">
        <v-list-item-avatar size="29" class="custom-list-item-avatar">
          <img :src="data.item.image">
        </v-list-item-avatar>
        <v-list-item-content class="custom-list-item-content">
          <v-list-item-title v-text="data.item.text"></v-list-item-title>
        </v-list-item-content>
      </template>
    </v-autocomplete>
    <div>
      <div
        v-for="field in fields"
        :key="field.id"
      >
        <v-text-field
          v-if="!field.hide"
          :id="field.id"
          :value="field.value"
          :label="field.label"
          :placeholder="field.placeholder"
          :suffix="field.suffix"
          :disabled="!search"
          :color="fieldSavedColour(field)"
          class="custom-text-field"
          outlined
          dense
          :prepend-inner-icon="determinePrependIcon(field)"
          @change="onTextFieldChangeHandler(field, $event)"
          @click:prepend-inner="onViewFieldHandler(field)"
        >
          <template v-slot:append>
            <v-icon
              class="custom-icon-append-hover"
              small
              :color="fieldSavedColour(field)"
              @click="onSaveFieldHandler(field)"
            >
              fa-save
            </v-icon>
          </template>
        </v-text-field>
      </div>
    </div>
    <div class="custom-team-controls-container">
      <v-select
        color="primary"
        class="body-2"
        label="I want to ..."
        value="team-0"
        dense
        :items="entitySelectOptions"
        return-object
      />
      <div class="custom-team-controls">
        <v-switch
          dense
          v-model="addToMapToggle"
          label="Place on Map"
        ></v-switch>
        <v-btn
          color="primary"
          :disabled="!search"
        >
          Go
        </v-btn>
      </div>
    </div>
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
import axios from 'axios'
import { MenuItem } from '../../TheEntityPanel.vue'

interface ShipItem {
  text: string;
  value: number;
  tier: number;
  image: string | undefined;
}

interface ShipField {
  id: string;
  value: string;
  hide: boolean;
  label: string;
  placeholder: string;
  saved: boolean | undefined;
  suffix: string;
  canvas: {
    isVisible: boolean;
    showIcon: boolean;
  };
}

interface SavedField {
  entityId: string;
  fieldId: string;
  value: string;
  canvasIsVisible: boolean;
  canvasShowIcon: boolean;
}

@Component({
  name: 'wows'
})
export default class Wows extends Vue {
  @Prop() private clickedItem!: string;
  @Prop() private teams!: MenuItem[];
  @Getter(`room/${RoomGetters.ROOM_STATE}`) roomState!: RoomState;

  search = ''

  selectedEntityId = ''

  savedFields: SavedField[] = []

  fields: ShipField[] = [{
    id: 'shipMainBatteryRange',
    value: '',
    hide: false,
    label: 'Main Battery Range',
    placeholder: 'e.g. 10',
    saved: undefined,
    suffix: 'km',
    canvas: {
      isVisible: false,
      showIcon: true
    }
  }, {
    id: 'shipSurfaceConcealment',
    value: '',
    hide: false,
    label: 'Surface Concealment',
    placeholder: 'e.g. 5',
    saved: undefined,
    suffix: 'km',
    canvas: {
      isVisible: false,
      showIcon: true
    }
  }, {
    id: 'shipPlaneConcealment',
    value: '',
    hide: false,
    label: 'Plane Concealment',
    placeholder: 'e.g. 3',
    saved: undefined,
    suffix: 'km',
    canvas: {
      isVisible: false,
      showIcon: true
    }
  }, {
    id: 'shipTorpedoesRange',
    value: '',
    hide: false,
    label: 'Torpedoes Range',
    placeholder: 'e.g. 10',
    saved: undefined,
    suffix: 'km',
    canvas: {
      isVisible: false,
      showIcon: true
    }
  }, {
    id: 'shipRadarRange',
    value: '',
    hide: false,
    label: 'Radar Range',
    placeholder: 'e.g. 9',
    saved: undefined,
    suffix: 'km',
    canvas: {
      isVisible: false,
      showIcon: true
    }
  }, {
    id: 'shipHydroRange',
    value: '',
    hide: false,
    label: 'Hydro Range',
    placeholder: 'e.g. 5',
    saved: undefined,
    suffix: 'km',
    canvas: {
      isVisible: false,
      showIcon: true
    }
  }]

  findField = (clickedFieldId: string): ShipField | undefined => this.fields.find((field: ShipField) => field.id === clickedFieldId)

  determinePrependIcon (clickedField: ShipField) {
    const foundField = this.findField(clickedField.id)
    if (foundField && foundField.canvas.showIcon) {
      return foundField.canvas.isVisible ? 'fa-eye-slash' : 'fa-eye'
    }
    return ''
  }

  addToMapToggle = true

  onViewFieldHandler (clickedField: ShipField) {
    const foundField = this.findField(clickedField.id)
    if (foundField) {
      foundField.canvas.isVisible = !foundField.canvas.isVisible
      foundField.saved = false
    }
  }

  onSaveFieldHandler (field: ShipField) {
    const foundField = this.findField(field.id)
    if (foundField) {
      foundField.saved = true
    }
    const foundSavedField = this.savedFields.find((savedField: SavedField) => savedField.entityId === this.selectedEntityId && savedField.fieldId === field.id)
    if (foundSavedField) {
      foundSavedField.value = field.value
      foundSavedField.canvasIsVisible = field.canvas.isVisible
      foundSavedField.canvasShowIcon = field.canvas.showIcon
    } else {
      this.savedFields.push({
        entityId: this.selectedEntityId,
        fieldId: field.id,
        value: field.value,
        canvasIsVisible: field.canvas.isVisible,
        canvasShowIcon: field.canvas.showIcon
      })
    }
  }

  onTextFieldChangeHandler (field: ShipField, value: string) {
    const foundField = this.findField(field.id)
    if (foundField) {
      foundField.value = value
      foundField.saved = false
    }
  }

  fieldSavedColour (field: ShipField) {
    return field.saved === undefined ? 'grey' : field.saved ? 'green' : 'red'
  }

  resolve = (path: string, shipData: any) => path.split('.').reduce((prev: any, curr: any) => prev ? prev[curr] : '', shipData || self)

  updateShipField = (shipData: any, fieldName: string, property: string, isRate = false) => {
    console.log(shipData); //eslint-disable-line
    const propertyValue = this.resolve(property, shipData)
    const foundField = this.findField(fieldName)
    if (foundField) {
      if (propertyValue) {
        foundField.value = isRate ? String(Math.floor((60 / propertyValue) * 10) / 10) : propertyValue
        foundField.hide = false
      } else {
        foundField.hide = true
      }
      foundField.saved = undefined
    }
  }

  async autoCompleteOnChangeHandler (shipItem: ShipItem) {
    const response = await axios.get(`https://api.worldofwarships.eu/wows/encyclopedia/shipprofile/?ship_id=${shipItem.value}&application_id=d84a218b4fec37003e799f13777bf880`)
    const shipData = response.data.data[shipItem.value]
    if (shipData) {
      this.selectedEntityId = shipData.ship_id
      this.updateShipField(shipData, 'shipMainBatteryRange', 'artillery.distance')
      this.updateShipField(shipData, 'shipTorpedoesRange', 'torpedoes.distance')
      this.updateShipField(shipData, 'shipSurfaceConcealment', 'concealment.detect_distance_by_ship')
      this.updateShipField(shipData, 'shipPlaneConcealment', 'concealment.detect_distance_by_plane')
    } else {
      this.selectedEntityId = shipItem.value.toString()
      const foundMainBatteryField = this.findField('shipMainBatteryRange')
      const foundTorpedoesField = this.findField('shipTorpedoesRange')
      const foundSurfaceConcealmentField = this.findField('shipSurfaceConcealment')
      const foundPlaneConcealmentField = this.findField('shipPlaneConcealment')
      if (foundMainBatteryField) foundMainBatteryField.value = ''
      if (foundTorpedoesField) {
        foundTorpedoesField.value = ''
        foundTorpedoesField.hide = false
      }
      if (foundSurfaceConcealmentField) foundSurfaceConcealmentField.value = ''
      if (foundPlaneConcealmentField) foundPlaneConcealmentField.value = ''
    }
    const foundRadarField = this.findField('shipRadarRange')
    const foundHydroField = this.findField('shipHydroRange')
    if (foundRadarField) foundRadarField.value = ''
    if (foundHydroField) foundHydroField.value = ''

    const foundSavedFields = this.savedFields.filter((savedField: SavedField) => savedField.entityId === this.selectedEntityId)
    foundSavedFields.forEach((foundSavedField: SavedField) => {
      const foundField = this.findField(foundSavedField.fieldId)
      if (foundField) {
        foundField.value = foundSavedField.value
        foundField.canvas.isVisible = foundSavedField.canvasIsVisible
        foundField.canvas.showIcon = foundSavedField.canvasShowIcon
        foundField.saved = true
      }
    })
  }

  get entitySelectOptions () {
    return this.teams.map((team: MenuItem, index: number) => ({
      text: `Add to ${team.title}`,
      value: `team-${index}`
    }))
  }

  get shipsData () {
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
.custom-list-item-content {
  padding: 0px;
  >div {
    font-size: 0.8rem;
  }
}

.custom-list-item-avatar {
  background-color: $room-navbar;
  >img {
    padding: 2px;
  }
}

.custom-text-field.custom-text-field {
  input{
    text-align: right;
  }
  .v-input__append-inner {
    align-self: normal;
    margin-top: 0px !important;
    margin-left: 0.5rem;
  }
  button {
    font-size: 1rem;
  }
}

.custom-team-controls-container {
  border: 1px solid #949494;
  border-radius: 0.25rem;
  padding: 20px 10px 0px 10px;
}

.custom-team-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.custom-icon-append-hover:hover {
  color: darkseagreen !important;
}
</style>
