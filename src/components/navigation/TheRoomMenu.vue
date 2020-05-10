<template>
  <v-menu v-if="!mobile" offset-y>
    <template v-slot:activator="{ on: menu }">
      <v-tooltip
        bottom
        nudge-bottom="10"
        :open-delay="500"
      >
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            dark
            icon
            v-on="{ ...tooltip, ...menu }"
          >
            <v-icon size="20">fa-cog</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('navigation.roomMenu.settings') }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item
        v-for="(roomMenuItem, index) in roomMenuItems"
        :key="index"
        :title=" $t(`navigation.roomMenu.${roomMenuItem.title}`)"
        @click="roomMenuItemsClickHandler(roomMenuItem)"
      >
        <v-list-item-title>{{ $t(`navigation.roomMenu.${roomMenuItem.text}`) }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-list v-else dense style="width: 100%;">
    <v-subheader>{{ $t('navigation.roomMenu.settings') }}</v-subheader>
    <v-list-item
      v-for="item in roomMenuItems"
      :key="item.text"
      link
      @click="roomMenuItemsClickHandler(item)"
    >
      <v-list-item-content>
        <v-list-item-title>{{ $t(`navigation.roomMenu.${item.text}`) }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { EventBus } from '@/event-bus'

enum RoomMenuEnum {
  NEW_TACTIC = 'newTactic',
  MANAGE_TACTIC = 'manageTactic',
  MANAGE_ROOM = 'manageRoom'
}

interface RoomMenuItem {
  text: string;
  title: string;
  type: RoomMenuEnum;
}

@Component({
  name: 'TheRoomMenu'
})
export default class TheRoomMenu extends Vue {
  @Prop() private mobile!: boolean;

  roomMenuItems: RoomMenuItem[] = [
    {
      text: 'newTactic.text',
      title: 'newTactic.title',
      type: RoomMenuEnum.NEW_TACTIC
    },
    {
      text: 'manageTactics.text',
      title: 'manageTactics.title',
      type: RoomMenuEnum.MANAGE_TACTIC
    },
    {
      text: 'manageRoom.text',
      title: 'manageRoom.title',
      type: RoomMenuEnum.MANAGE_ROOM
    }
  ]

  // eslint-disable-next-line
  roomMenuItemsClickHandler (item: RoomMenuItem) {
    switch (item.type) {
      case RoomMenuEnum.NEW_TACTIC: EventBus.$emit('openCreateNewTacticOverlay'); break
      case RoomMenuEnum.MANAGE_ROOM: /* Do something */ break
      case RoomMenuEnum.MANAGE_TACTIC: /* Do something */ break
    }
  }
}

</script>
<style scoped lang="scss">

</style>
