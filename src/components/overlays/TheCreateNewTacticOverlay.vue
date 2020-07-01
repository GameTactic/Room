<template>
  <v-dialog
    v-model="overlay"
    width="700"
    class="custom-overlay"
  >
    <v-card class="pa-12">
      <v-row>
        <v-col>
          <v-card-title>
            {{ $t('tactic.createTacticOverlay.title') }}
          </v-card-title>
          <v-card-actions>
            <v-text-field
              v-model="tactic.name"
              :label="$t('tactic.overlay.name')"
              prepend-icon="fa-file"
            />
          </v-card-actions>
          <v-card-actions v-if="maps !== false">
            <v-autocomplete
              v-model="tactic.map"
              :items="maps"
              :search-input.sync="search"
              :label="$t('tactic.overlay.maps')"
              :placeholder="$t('tactic.overlay.search')"
              item-text="name"
              color="primary"
              hide-no-data
              hide-selected
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
              :disabled="isDisabled()"
              color="primary"
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
import { AppRoomAction, AppRoomGetters } from '@/store/modules/app/room'
import { namespace } from 'vuex-class'
import { Api, Collection, Game, Team } from '@/store/types'
import { SocketStageActions } from '@/store/modules/socket/stage'
import { CustomStageConfig } from '@/util/PointerEventMapper'
import { SocketCanvasAction } from '@/store/modules/socket/canvas'
import { CanvasElement, CanvasElementHistory } from '@/types/Canvas'
import TacticWatcher from '@/mixins/TacticWatcher'
import uuid from 'uuid'
import { AppAuthenticationGetters } from '@/store/modules/app/authentication'
import { SocketTacticGetters } from '@/store/modules/socket/tactic'
import { Namespaces } from '@/store'
import { MapsDataApi } from '@/types/Games/Wows'
import HandleTactic from '@/util/HandleTactic'
import { GameApiRoutes } from '@/games/types'
import { SocketRoomGetters } from '@/store/modules/socket/room'

const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
const AppRoom = namespace(Namespaces.APP_ROOM)
const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)
const SocketStage = namespace(Namespaces.SOCKET_STAGE)
const SocketCanvas = namespace(Namespaces.SOCKET_CANVAS)

@Component({
  name: 'TheCreateNewTacticOverlay',
  mixins: [TacticWatcher]
})
export default class CreateNewTacticOverlay extends mixins(TacticWatcher) {
  @AppRoom.Getter(AppRoomGetters.API) api!: Api[]
  @SocketTactic.Getter(SocketTacticGetters.COLLECTIONS) collections!: Collection[]
  @SocketStage.Action(SocketStageActions.SET_CONFIG) setConfig!: (config: CustomStageConfig) => void
  @SocketCanvas.Action(SocketCanvasAction.SET_CANVAS_ELEMENT) setCanvasElements!: (canvasElements: CanvasElement[]) => void
  @SocketCanvas.Action(SocketCanvasAction.SET_CANVAS_ELEMENT_HISTORY) setCanvasElementsHistory!: (canvasElements: CanvasElementHistory[]) => void
  @AppRoom.Getter(AppRoomGetters.IS_CANVAS_LOADED) isCanvasLoaded!: boolean
  @AppRoom.Action(AppRoomAction.SET_IS_CANVAS_LOADED) setIsCanvasLoaded!: (isCanvasLoaded: boolean) => void
  @SocketRoom.Getter(SocketRoomGetters.GAME) currentGame!: Game

  tactic = {
    map: {
      name: '',
      icon: '',
      desc: '',
      width: 0,
      height: 0,
      ratio: 0,
      id: 0
    },
    name: '',
    teams: [
      {
        name: 'teams.one',
        color: '#43A047'
      },
      {
        name: 'teams.two',
        color: '#E53935'
      }
    ]
  }
  search = ''
  overlay = false

  created () {
    EventBus.$on('openCreateNewTacticOverlay', () => {
      this.overlay = !this.overlay
    })
  }

  get maps () {
    const mapApi: Api | undefined = this.api.find((api: Api) => (this.currentGame !== Game.NONE) && api.name === GameApiRoutes[this.currentGame].maps)
    if (mapApi) {
      return (mapApi.data as MapsDataApi).maps
    } else {
      return false
    }
  }

  $refs!: {
    img: HTMLImageElement;
    imgName: HTMLHeadingElement;
  }

  isDisabled (): boolean {
    return !(this.tactic.name && this.tactic.map.icon)
  }

  // Need to do more to this, but we dont have the collection stuff created yet so this is temporary.
  createTactic (): void {
    const foundCollection = this.collections.find((collection: Collection) => collection.name === 'root')
    if (!this.isDisabled() && foundCollection) {
      if (!this.isCanvasLoaded) { this.setIsCanvasLoaded(true) }
      const id = uuid()
      const teams: Team[] = this.tactic.teams.map((v) => {
        return {
          id: uuid(),
          name: v.name,
          color: v.color,
          entities: [],
          tacticId: id
        }
      })
      new HandleTactic({
        id: id,
        name: this.tactic.name,
        collectionId: foundCollection.id,
        canvasElements: [],
        canvasElementsHistory: [],
        teams: teams,
        lockedBy: undefined,
        isPinned: false,
        createdBy: this.$store.getters[`${Namespaces.APP_AUTHENTICATION}/${AppAuthenticationGetters.JWT}`].jti,
        map: this.tactic.map
      }).createNewTactic()
      this.resetTacticForm()
      this.overlay = false
    }
  }

  resetTacticForm () {
    this.tactic = {
      map: {
        name: '',
        icon: '',
        desc: '',
        width: 1,
        height: 1,
        ratio: 0,
        id: 0
      },
      name: '',
      teams: [...this.tactic.teams]
    }
  }
}
</script>
<style lang="scss" scoped>
  .custom-overlay {
    width: 700px;
  }
</style>
