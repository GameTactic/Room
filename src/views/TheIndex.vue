<template>
  <p>{{ $t('index.redirected') }}</p>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { v4 as uuid } from 'uuid'
import { namespace } from 'vuex-class'
import { SocketRoomAction } from '../store/modules/socket/room'
import { Namespaces } from '@/store'

const SocketRoom = namespace(Namespaces.SOCKET_ROOM)

@Component({
  name: 'TheIndex'
})
export default class TheIndex extends Vue {
  @SocketRoom.Action(SocketRoomAction.SET_ROOM_ID) setRoomId!: (roomId: string) => void
  created () {
    const roomId = uuid().toString()
    this.setRoomId(roomId)
    this.$router.push('/' + roomId)
  }
}
</script>
<style scoped lang="scss"/>
