<template>
  <div>
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
          :prepend-inner-icon="determinePrependIcon(fields, field)"
          @change="onTextFieldChangeHandler(fields, field, $event)"
          @click:prepend-inner="onViewFieldHandler(fields, field)"
        >
          <template v-slot:append>
            <v-icon
              class="custom-icon-append-hover"
              small
              :color="fieldSavedColour(field)"
              @click="onSaveFieldHandler(fields, savedFields, field)"
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
</template>
<script lang="ts">
import { Prop } from 'vue-property-decorator'
import Component from 'vue-class-component'
import axios from 'axios'
import Games from '@/mixins/Games'
import { ShipItem, ShipField } from '../../../types/Games/Wows'
import { SavedField } from '../../../types/Games'
import { MenuItem } from '../../TheEntityPanel.vue'

@Component({
  name: 'TheCreateEntity',
  mixins: [Games]
})
export default class TheCreateEntity extends Games {
  @Prop() private clickedItem!: string;
  @Prop() private teams!: MenuItem[];
  @Prop() private shipsData!: ShipItem[];

  search = ''
  selectedEntityId = ''
  addToMapToggle = true
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

  async autoCompleteOnChangeHandler (shipItem: ShipItem) {
    const response = await axios.get(`https://api.worldofwarships.eu/wows/encyclopedia/shipprofile/?ship_id=${shipItem.value}&application_id=d84a218b4fec37003e799f13777bf880`)
    const shipData = response.data.data[shipItem.value]
    if (shipData) {
      this.selectedEntityId = shipData.ship_id
      this.updateField(this.fields, shipData, 'shipMainBatteryRange', 'artillery.distance')
      this.updateField(this.fields, shipData, 'shipTorpedoesRange', 'torpedoes.distance')
      this.updateField(this.fields, shipData, 'shipSurfaceConcealment', 'concealment.detect_distance_by_ship')
      this.updateField(this.fields, shipData, 'shipPlaneConcealment', 'concealment.detect_distance_by_plane')
    } else {
      this.selectedEntityId = shipItem.value.toString()
      const foundMainBatteryField = this.findField(this.fields, 'shipMainBatteryRange')
      const foundTorpedoesField = this.findField(this.fields, 'shipTorpedoesRange')
      const foundSurfaceConcealmentField = this.findField(this.fields, 'shipSurfaceConcealment')
      const foundPlaneConcealmentField = this.findField(this.fields, 'shipPlaneConcealment')
      if (foundMainBatteryField) foundMainBatteryField.value = ''
      if (foundTorpedoesField) {
        foundTorpedoesField.value = ''
        foundTorpedoesField.hide = false
      }
      if (foundSurfaceConcealmentField) foundSurfaceConcealmentField.value = ''
      if (foundPlaneConcealmentField) foundPlaneConcealmentField.value = ''
    }
    const foundRadarField = this.findField(this.fields, 'shipRadarRange')
    const foundHydroField = this.findField(this.fields, 'shipHydroRange')
    if (foundRadarField) foundRadarField.value = ''
    if (foundHydroField) foundHydroField.value = ''

    const foundSavedFields = this.savedFields.filter((savedField: SavedField) => savedField.entityId === this.selectedEntityId)
    foundSavedFields.forEach((foundSavedField: SavedField) => {
      const foundField = this.findField(this.fields, foundSavedField.fieldId)
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
