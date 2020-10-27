<template>
  <tactic-content
    :overlay="overlay"
    :tactic="tactic"
    :search="search"
    :maps="maps"
    :isActionButtonDisabled="isActionButtonDisabled()"
    title="tactic.createTacticOverlay.title"
    actionButtonTitle="tactic.createTacticOverlay.create"
    @tacticNameOnChangeHandler="tactic.name = $event"
    @tacticMapOnChangeHandler="tactic.map = $event"
    @searchInputOnChangeHandler="search = $event"
    @actionButtonOnClickHandler="createTacticOnClickHandler"
    @overlayOnChangeHandler="overlay = $event"
  />
</template>
<script lang="ts">
import Component, { mixins } from 'vue-class-component'
import { EventBus } from '@/event-bus'
import { AppRoomAction, AppRoomGetters } from '@/store/modules/app/room'
import { namespace } from 'vuex-class'
import { Api, Collection, Game, Team } from '@/store/types'
import TacticWatcher from '@/mixins/tacticWatcher'
import { v4 as uuid } from 'uuid'
import { AppAuthenticationGetters } from '@/store/modules/app/authentication'
import { SocketTacticGetters } from '@/store/modules/socket/tactic'
import { Namespaces } from '@/store'
import { MapsDataApi } from '@/types/games/wows'
import HandleTactic from '@/util/handleTactic'
import { GameApiRoutes } from '@/games/utils'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import { OpenOverlayList } from './types'
import TacticContent from './TacticContent.vue'

const SocketRoom = namespace(Namespaces.SOCKET_ROOM)
const AppRoom = namespace(Namespaces.APP_ROOM)
const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)

@Component({
  name: 'TheCreateNewTacticOverlay',
  mixins: [TacticWatcher],
  components: { TacticContent }
})
export default class TheCreateNewTacticOverlay extends mixins(TacticWatcher) {
  @AppRoom.Getter(AppRoomGetters.API) api!: Api[]
  @SocketTactic.Getter(SocketTacticGetters.COLLECTIONS) collections!: Collection[]
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
    EventBus.$on(OpenOverlayList.OPEN_THE_CREATE_TACTIC_OVERLAY, () => {
      this.overlay = !this.overlay
    })
  }

  get maps () {
    const mapApi: Api | undefined = this.api.find((api: Api) => (this.currentGame !== Game.NONE) && api.name === GameApiRoutes[this.currentGame].maps)
    return mapApi ? (mapApi.data as MapsDataApi).maps : false
  }

  isActionButtonDisabled (): boolean {
    return !(this.tactic.name && this.tactic.map.icon)
  }

  // Need to do more to this, but we dont have the collection stuff created yet so this is temporary.
  createTacticOnClickHandler (): void {
    const foundCollection = this.collections.find((collection: Collection) => collection.name === 'root')
    if (!this.isActionButtonDisabled() && foundCollection) {
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
