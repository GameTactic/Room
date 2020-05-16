<template>
    <v-dialog
      v-if="selectedTactic && selectedTactic.map"
      v-model="overlay"
      width="700"
      class="custom-overlay"
    >
      <v-card class="pa-12">
        <v-row>
          <v-col>
            <v-card-title>
              {{ $t('tactic.updateTacticOverlay.title') }}
            </v-card-title>
            <v-card-actions>
              <v-text-field
                prepend-icon="fa-file"
                :label="$t('tactic.overlay.name')"
                v-model="selectedTactic.name"
              />
            </v-card-actions>
            <v-card-actions v-if="maps !== false">
              <v-autocomplete
                :items="maps"
                item-text="name"
                :search-input.sync="search"
                v-model="selectedTactic.map"
                color="primary"
                hide-no-data
                hide-selected
                :label="$t('tactic.overlay.maps')"
                :placeholder="$t('tactic.overlay.search')"
                prepend-icon="fa-search"
                autocomplete="new-password"
                return-object
              >
                <template v-slot:item="data">
                  <v-list-item-avatar size="29" class="custom-list-item-avatar">
                    <img :src="data.item.icon" :alt="data.item.name">
                  </v-list-item-avatar>
                  <v-list-item-content class="custom-list-item-content">
                    <v-list-item-title v-text="data.item.name"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-card-actions>
            <v-spacer></v-spacer>
            <v-card-subtitle>
              <v-btn
                color="primary"
                @click="updateTacticOnClickHandler()"
              >
                {{ $t('tactic.updateTacticOverlay.update') }}
              </v-btn>
            </v-card-subtitle>
          </v-col>
          <v-divider class="d-none" vertical />
          <v-col>
            <v-card-subtitle>
              <v-img v-if="selectedTactic.map.icon" :src="selectedTactic.map.icon" max-width="200px"/>
            </v-card-subtitle>
            <v-card-subtitle>{{ selectedTactic.map.name }}</v-card-subtitle>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { EventBus } from '@/event-bus'
import { RoomGetters } from '@/store/modules/room'
import { Action, Getter } from 'vuex-class'
import { Api, Tactic } from '@/store/modules/types'
import { StageActions } from '@/store/modules/stage'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import { CanvasAction } from '@/store/modules/canvas'
import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import TacticWatcher from '@/mixins/TacticWatcher'

@Component({
  name: 'TheUpdateTacticOverlay',
  mixins: [TacticWatcher]
})
export default class TheUpdateTacticOverlay extends mixins(TacticWatcher) {
  @Getter(`room/${RoomGetters.GAME_API}`) gameApi!: Api[]
  @Action(`stage/${StageActions.SET_CONFIG}`) setConfig!: (config: CustomStageConfig) => void
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT}`) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT_HISTORY}`) setCanvasElementsHistory!: (canvasElements: CanvasElementHistory[]) => void

  search = ''
  selectedTactic: Tactic | {} = {}
  overlay = false
  created () {
    EventBus.$on('openManageTacticsOverlay', (tactic: Tactic) => {
      this.overlay = !this.overlay
      this.selectedTactic = { ...tactic }
    })
  }

  get maps () {
    const mapApi: Api[] = this.gameApi.filter((api: Api) => api.name === 'wows.encyclopedia.maps')
    if (mapApi.length === 1) {
      return mapApi[0].data
    } else {
      return false
    }
  }

  $refs!: {
    img: HTMLImageElement;
    imgName: HTMLHeadingElement;
  }

  // Need to do more to this, but we dont have the collection stuff created yet so this is temporary.
  updateTacticOnClickHandler (): void {
    if (this.selectedTactic && Object.keys(this.selectedTactic).length) {
      this.updateTactic(this.selectedTactic as Tactic)
      this.resetTacticForm()
    }
    this.overlay = false
  }

  resetTacticForm () {
    this.$data.tactic = {
      map: {
        name: '',
        icon: '',
        desc: '',
        width: 0,
        height: 0,
        ratio: 0,
        id: 0
      },
      name: ''
    }
  }
}
</script>
<style lang="scss" scoped>
  .custom-overlay {
    width: 700px;
  }
</style>
