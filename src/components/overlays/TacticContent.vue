<template>
  <v-dialog
    v-if="tactic"
    :value="overlay"
    width="800"
    eager
    @change="$emit('overlayOnChangeHandler', $event)"
  >
    <v-card class="pa-12">
      <v-row>
        <v-col>
          <v-card-title v-text="$t(title)" />
          <v-card-actions>
            <v-text-field
              :value="tactic.name"
              :label="$t('tactic.overlay.name')"
              prepend-icon="fa-file"
              @change="$emit('tacticNameOnChangeHandler', $event)"
            />
          </v-card-actions>
          <v-card-actions v-if="maps !== false">
            <v-autocomplete
              :value="tactic.map"
              :items="maps"
              :search-input="search"
              :label="$t('tactic.overlay.maps')"
              :placeholder="$t('tactic.overlay.search')"
              item-text="name"
              color="primary"
              hide-no-data
              hide-selected
              prepend-icon="fa-search"
              autocomplete="new-password"
              return-object
              @change="$emit('tacticMapOnChangeHandler', $event)"
              @update:search-input="$emit('searchInputOnChangeHandler', $event)"
            >
              <template v-slot:item="data">
                <v-list-item-avatar v-if="data.item" :title="data.item.name" size="29">
                  <img :src="data.item.icon" :alt="data.item.name">
                </v-list-item-avatar>
                <v-list-item-content v-if="data.item" :title="data.item.name" class="custom-list-item-content">
                  <v-list-item-title v-text="data.item.name" />
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-card-actions>
          <v-spacer></v-spacer>
          <v-card-subtitle>
            <v-btn
              :disabled="isActionButtonDisabled || false"
              color="primary"
              @click="$emit('actionButtonOnClickHandler', $event)"
              v-text="$t(actionButtonTitle)" />
          </v-card-subtitle>
        </v-col>
        <v-divider class="d-none" vertical />
        <v-col>
          <v-card-subtitle v-if="tactic.map">
            <v-img :src="tactic.map.icon" max-width="200px"/>
          </v-card-subtitle>
          <v-card-subtitle v-if="tactic.map">{{ tactic.map.name }}</v-card-subtitle>
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Tactic, Map } from '@/store/types'

@Component({
  name: 'TacticContent'
})
export default class TacticContent extends Vue {
  @Prop() readonly isActionButtonDisabled?: boolean;
  @Prop() readonly overlay!: boolean;
  @Prop() readonly tactic!: Tactic | null;
  @Prop() readonly search!: string;
  @Prop() readonly maps!: Map[];
  @Prop() readonly title!: string;
  @Prop() readonly actionButtonTitle!: string;
}
</script>
<style lang="scss" scoped>
  .custom-list-item-content {
    max-width: 190px;
  }
</style>
