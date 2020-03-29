<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn
        title="Room and tactic settings"
        dark
        icon
        v-on="on"
      >
        <v-icon>fa-cogs</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="(roomMenuItem, index) in roomMenuItems"
        :key="index"
        :title="roomMenuItem.title"
        @click="roomMenuItemsClickHandler(roomMenuItem)"
      >
        <v-list-item-title>{{ roomMenuItem.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

interface RoomMenuItem {
  text: string;
  title: string;
}

@Component({
  name: 'TheRoomMenu'
})
export default class TheRoomMenu extends Vue {
  @Prop() private id!: string;

  roomMenuItems: RoomMenuItem[] = [{
    text: 'New Tactic',
    title: 'Create a new tactic within your room'
  }, {
    text: 'Manage Tactics',
    title: 'Manage your existing tactics within your room'
  }, {
    text: 'Manage Room',
    title: 'Manage the rooms settings'
  }]

  roomMenuItemsClickHandler (item: RoomMenuItem) {
    console.log('CLICKED', item)
  }
}

</script>
<style scoped lang="scss">

</style>
