<template>
  <accordion-item>
    <template v-slot:header>
      {{ getGameName(game) }}
    </template>
    <template v-slot:content>
      <the-entity-list-content />
    </template>
  </accordion-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import AccordionItem from '../AccordionItem.vue'
import TheEntityListContent from './TheEntityListContent.vue'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { getGameName } from '@/games/utils'
import { SocketRoomGetters } from '@/store/modules/socket/room'
import { Game } from '@/store/types'

const SocketRoom = namespace(Namespaces.SOCKET_ROOM)

@Component({
  name: 'TheEntityList',
  components: {
    TheEntityListContent,
    AccordionItem
  }
})
export default class TheEntityList extends Vue {
 @SocketRoom.Getter(SocketRoomGetters.GAME) game!: Game

 getGameName = getGameName
}
</script>

<style lang="scss" scoped>
</style>
