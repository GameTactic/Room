<template>
  <accordion-item>
    <template v-slot:header>
      {{ getEntityName(game) + 's' }}
    </template>
    <template v-slot:content>
      <the-wows-entity-list-content v-if="game === Game.WOWS" :game="game" />
    </template>
  </accordion-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import AccordionItem from '../AccordionItem.vue'
import TheWowsEntityListContent from './wows/TheEntityListContent.vue'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { getEntityName } from '@/games/utils'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import { Game } from '@/store/types'

const SocketRoom = namespace(Namespaces.SOCKET_ROOM)

@Component({
  name: 'TheEntityList',
  components: {
    TheWowsEntityListContent,
    AccordionItem
  }
})
export default class TheEntityList extends Vue {
  @SocketRoom.Getter(SocketRoomGetters.GAME) game!: Game

  getEntityName = getEntityName
  Game = Game
}
</script>

<style lang="scss" scoped>
</style>
