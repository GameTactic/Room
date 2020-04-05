<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on: menu }">
      <v-tooltip bottom nudge-bottom="10">
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            dark
            icon
            v-on="{ ...tooltip, ...menu }"
          >
            <v-icon size="20">fa-cog</v-icon>
          </v-btn>
        </template>
        <span>Settings</span>
      </v-tooltip>
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
    // do stuff
  }
}

</script>
<style scoped lang="scss">

</style>
