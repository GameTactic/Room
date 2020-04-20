<template>
  <v-menu v-if="!mobile" offset-y>
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
  <v-list v-else dense style="width: 100%;">
    <v-subheader>Settings</v-subheader>
    <v-list-item
      v-for="item in roomMenuItems"
      :key="item.text"
      link
    >
      <v-list-item-content>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

interface RoomMenuItem {
  text: string;
  title: string;
}

@Component({
  name: 'TheRoomMenu'
})
export default class TheRoomMenu extends Vue {
  @Prop() private mobile!: boolean;

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

  // eslint-disable-next-line
  roomMenuItemsClickHandler (item: RoomMenuItem) {
    // do stuff
  }
}

</script>
<style scoped lang="scss">

</style>
