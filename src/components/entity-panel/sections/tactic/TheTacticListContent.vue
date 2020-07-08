<template>
  <span v-if="!items.length" class="caption px-2" v-text="$t('tactic.noTacticsFound')"/>
  <v-treeview
    v-else
    v-model="activeElements"
    :items="items"
    :open="open"
    class="pa-0"
    dense
    open-on-click
    activatable
  >
    <template v-slot:prepend="{ item, isOpen }">
      <v-icon v-if="item.children">
        {{ isOpen ? 'fa-folder-open' : 'fa-folder' }}
      </v-icon>
      <v-avatar
        v-else
        size="30"
        class="ml-0 pl-0"
      >
        <img :src="item.tactic.map.icon">
      </v-avatar>
    </template>
    <template v-slot:label="{ item }">
      <span
        v-if="!item.children"
        class="d-flex justify-space-between align-center"
        @click="switchTactic(item.id)"
      >
          <span class="d-flex flex-column">
            <span class="body-2" v-text="item.name" />
            <span class="caption" v-text="item.tactic.map.name" />
          </span>
          <v-btn
            elevation="0"
            tile
            class="mr-1 px-0"
            :width="30"
            color="transparent"
            ripple
            small
          >
            <v-badge
              :v-if="numberUsersOnTactic(item.id) > 0"
              :content="numberUsersOnTactic(item.id)"
              right
              overlap
              color="primary"
            >
              <v-icon color="grey darken-1">fa-user-circle</v-icon>
            </v-badge>
          </v-btn>
        </span>
      <a v-else>{{ item.name }}</a>
    </template>
    <template v-slot:append="{ item: item }">
      <v-menu
        v-if="!item.children"
        offset-y
        nudge-left="100"
        nudge-width="80"
        content-class="elevation-2"
      >
        <template v-slot:activator="{ on: menuItem }">
          <v-btn
            elevation="0"
            color="transparent"
            fab
            small
            ripple
            v-on="menuItem"
          >
            <v-icon small color="grey darken-1">fa-ellipsis-v</v-icon>
          </v-btn>
        </template>
        <v-card tile>
          <v-list dense>
            <v-list-item
              v-for="(cardItem, index) in cardMenuItems"
              :key="index"
              @click="tacticMenuOnClickHandler(cardItem, item.tactic)"
            >
              <v-list-item-icon class="custom-autocomplete-tactic-menu-icon">
                <v-icon
                  :color="tacticMenuColour(item.tactic, cardItem)"
                  small
                  v-text="tacticMenuIcon(item.tactic, cardItem)" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="tacticMenuPinText(item.tactic, cardItem)" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </template>
  </v-treeview>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { SocketTacticAction, SocketTacticGetters } from '@/store/modules/socket/tactic'
import { Collection, Tactic } from '@/store/types'
import { MenuItem, TacticMenuOptions, TreeViewItem } from '../../types'
import { EventBus } from '@/event-bus'
import { SocketUserGetters } from '@/store/modules/socket/user'
import HandleTactic from '@/util/handleTactic'
import { OpenOverlayList } from '@/components/overlays/types'

const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)
const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'TheTacticListContent'
})
export default class TheTacticListContent extends Vue {
  @SocketTactic.Getter(SocketTacticGetters.COLLECTIONS) collections!: Collection[]
  @SocketTactic.Getter(SocketTacticGetters.TACTICS) tactics!: Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.PINNED_TACTICS) pinnedTactics!: Tactic[]
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED) isAuthorised!: boolean;
  @SocketTactic.Action(SocketTacticAction.DELETE_TACTIC) deleteTactic!: (id: string) => void
  @SocketTactic.Action(SocketTacticAction.UPDATE_TACTIC) updateTactic!: (tactic: Tactic) => void
  @SocketTactic.Action(SocketTacticAction.TOGGLE_PIN_TACTIC) togglePinTactic!: (tactic: Tactic) => void
  activeElements: TreeViewItem[] = []
  open: string[] = []
  search: string | null = null

  get items (): TreeViewItem[] {
    const collections: TreeViewItem[] = this.collections.map((collection: Collection) => {
      const tactics: Tactic[] = this.tactics.filter((tactic: Tactic) => tactic.collectionId === collection.id)
      return {
        id: collection.id,
        name: collection.name,
        parent: collection.parentCollectionId,
        children: tactics.map((tactic: Tactic) => ({
          parent: tactic.collectionId,
          id: tactic.id,
          name: tactic.name,
          tactic: tactic,
          icon: tactic.map.icon || 'fa-map'
        }))
      }
    })
    collections.forEach((collection: TreeViewItem) => {
      if (collection.parent) {
        const parent = collections.find((parent: TreeViewItem) => parent.id === collection.parent)
        if (parent?.children) {
          parent.children.push(collection)
        }
      }
    })
    return collections[0].children || []
  }

  switchTactic (id: string) {
    const tactic: Tactic | undefined = this.tactics.find((tactic: Tactic) => tactic.id === id)
    if (tactic) {
      new HandleTactic(tactic).setLocal()
    }
  }

  // TODO: We do not have the logic to determine which users are viewing which Tactic yet
  numberUsersOnTactic () {
    return 1
  }

  tacticMenuOnClickHandler (menuItem: MenuItem, tactic: Tactic) {
    switch (menuItem.action) {
      case TacticMenuOptions.EDIT:
        EventBus.$emit(OpenOverlayList.OPEN_THE_UPDATE_TACTIC_OVERLAY, tactic)
        break
      case TacticMenuOptions.DELETE:
        this.deleteTactic(tactic.id)
        break
      case TacticMenuOptions.PIN:
        this.togglePinTactic(tactic)
        break
      default:
        break
    }
  }

  tacticMenuColour (tactic: Tactic, item: MenuItem) {
    if (item.action === TacticMenuOptions.PIN && tactic.pinned) {
      return 'primary'
    } else if (item.action === TacticMenuOptions.DELETE) {
      return 'error'
    }
    return ''
  }

  tacticMenuIcon (tactic: Tactic, item: MenuItem) {
    return item.icon
  }

  tacticMenuPinText (tactic: Tactic, item: MenuItem) {
    return item.action === TacticMenuOptions.PIN && tactic.isPinned && item.titleTwo ? this.$t(item.titleTwo) : this.$t(item.title)
  }

  cardMenuItems: MenuItem[] = [{
    action: TacticMenuOptions.EDIT,
    title: 'tactic.edit',
    icon: 'fa-edit'
  }, {
    action: TacticMenuOptions.PIN,
    title: 'tactic.pin',
    titleTwo: 'tactic.unpin',
    icon: 'fa-bookmark'
  }, {
    action: TacticMenuOptions.DELETE,
    title: 'tactic.delete',
    icon: 'fa-times'
  }]
}
</script>
<style lang="scss">
.v-treeview-node__level{
  width: 12px !important;
}
.custom-autocomplete-tactic-menu-icon {
  margin-right: 6px !important;
}

.custom-expansion-panel-content .v-treeview-node__root {
  padding-left: 0;
  padding-right: 4px;
}
</style>
