<template>
  <p>{{ $t('index.redirected') }}</p>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import uuid from 'uuid'
import { Action } from 'vuex-class'
import { RoomAction } from '../store/modules/room'

@Component({
  name: 'Index'
})
export default class extends Vue {
  @Action(`room/${RoomAction.SET_ROOM_ID}`) setRoomId!: (roomId: string) => void
  created () {
    const roomId = uuid.v4().toString()
    this.setRoomId(roomId)
    this.$router.push('/' + roomId)
  }
}
</script>
<style scoped lang="scss"/>
