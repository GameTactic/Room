<template>
  <accordion-item
    :isRightButtonDisabled="!ApiMaps"
    icon="fa-plus"
    @rightButtonClicked="newTacticOnClickHandler"
  >
    <template v-slot:header>
      {{ $t('tactic.title')}}
    </template>
    <template v-slot:content>
      <the-tactic-list-content />
    </template>
  </accordion-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { EventBus } from '@/event-bus'
import AccordionItem from '../AccordionItem.vue'
import TheTacticListContent from './TheTacticListContent.vue'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { AppRoomGetters } from '@/store/modules/app/room'
import { Api, Game } from '@/store/types'
import { GameApiRoutes } from '@/games/utils'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import { OpenOverlayList } from '@/components/overlays/types'

const AppRoom = namespace(Namespaces.APP_ROOM)
const SocketRoom = namespace(Namespaces.SOCKET_ROOM)

@Component({
  name: 'TheTacticList',
  components: {
    TheTacticListContent,
    AccordionItem
  }
})
export default class TheTacticList extends Vue {
  @AppRoom.Getter(AppRoomGetters.API) api!: Api[]
  @SocketRoom.Getter(SocketRoomGetters.GAME) currentGame!: Game

  get ApiMaps () {
    const mapApi: Api | undefined = this.api.find((api: Api) => (this.currentGame !== Game.NONE) && api.name === GameApiRoutes[this.currentGame].maps)
    return !!mapApi
  }

  newTacticOnClickHandler () {
    EventBus.$emit(OpenOverlayList.OPEN_THE_CREATE_TACTIC_OVERLAY)
  }
}
</script>

<style lang="scss" scoped>
</style>
