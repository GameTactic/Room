<template>
    <v-dialog v-if="isAuth" v-model="overlay" width="700" class="custom-overlay">
      <v-card class="pa-12">
        <v-row>
          <v-col>
            <v-card-title>
              {{ $t('tactic.createTacticOverlay.title') }}
            </v-card-title>
            <v-card-actions>
              <v-text-field
                :rules="[rules.length]"
                prepend-icon="fa-file"
                label="Tactic name"
                v-model="tactic.name"
              />
            </v-card-actions>
            <v-card-actions v-if="maps !== false">
              <v-autocomplete
                :items="maps"
                item-text="name"
                :search-input.sync="search"
                v-model="tactic.map"
                color="primary"
                hide-no-data
                hide-selected
                :label="$t('tactic.createTacticOverlay.maps')"
                :placeholder="$t('tactic.createTacticOverlay.search')"
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
                :disabled="!tactic.name.length"
                @click="createTactic()"
              >
                {{ $t('tactic.createTacticOverlay.create') }}
              </v-btn>
            </v-card-subtitle>
          </v-col>
          <v-divider class="d-none" vertical />
          <v-col>
            <v-card-subtitle>
              <v-img v-if="tactic.map.icon" :src="tactic.map.icon" max-width="200px"/>
            </v-card-subtitle>
            <v-card-subtitle>{{ tactic.map.name }}</v-card-subtitle>
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
import { Api } from '@/store/modules/types'
import { StageActions } from '@/store/modules/stage'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import { CanvasAction } from '@/store/modules/canvas'
import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import TacticWatcher from '@/mixins/TacticWatcher'
import uuid from 'uuid'
import { AuthenticationGetters, JWT } from '@/store/modules/authentication'

@Component({
  name: 'TheCreateNewTacticOverlay',
  data: () => ({
    rules: {
      length: (v: string) => (v || '').length >= 1 || 'Name can not be empty'
    },
    tactic: {
      map: {
        name: '',
        icon: '',
        desc: '',
        width: 1,
        height: 1,
        ratio: 0,
        id: 0
      },
      name: ''
    },
    search: ''
  }),
  mixins: [TacticWatcher]
})
export default class CreateNewTacticOverlay extends mixins(TacticWatcher) {
  @Getter(`room/${RoomGetters.GAME_API}`) gameApi!: Api[]
  @Action(`stage/${StageActions.SET_CONFIG}`) setConfig!: (config: CustomStageConfig) => void
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT}`) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @Action(`canvas/${CanvasAction.SET_CANVAS_ELEMENT_HISTORY}`) setCanvasElementsHistory!: (canvasElements: CanvasElementHistory[]) => void
  @Getter(`authentication/${AuthenticationGetters.IS_AUTH}`) isAuth!: boolean
  @Getter(`authentication/${AuthenticationGetters.JWT}`) jwt!: JWT | null

  overlay = false
  created () {
    EventBus.$on('openCreateNewTacticOverlay', () => {
      this.overlay = !this.overlay
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
  createTactic (): void {
    if (this.$data.tactic.name && this.isAuth && this.jwt !== null) {
      EventBus.$emit('loadCanvas')
      this.newTactic({
        id: uuid(),
        name: this.$data.tactic.name,
        collectionId: uuid(),
        canvasElements: [],
        canvasElementsHistory: [],
        lockedBy: undefined,
        createdBy: this.jwt.jti,
        map: this.$data.tactic.map
      })
      this.resetTacticForm()
      this.overlay = false
    }
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
