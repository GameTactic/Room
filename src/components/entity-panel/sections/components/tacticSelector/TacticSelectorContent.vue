<template>
  <v-treeview
    v-model="active"
    :items="items"
    open-on-click
    :open="open"
    activatable
  >
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.children">
        {{ open ? 'fa-folder-open' : 'fa-folder' }}
      </v-icon>
      <v-avatar
        v-else
        size="30"
        class="ml-0"
      >
        <img :src="item.tactic.map.icon">
      </v-avatar>
    </template>
    <template v-slot:label="{ item }">
      <span
        v-if="!item.children"
        @click="switchTactic(item.id)"
        class="d-flex justify-space-between align-center"
      >
          <span class="d-flex flex-column">
            <span class="body-2" v-text="item.name" />
            <span class="caption" v-text="item.tactic.map.name" />
          </span>
          <v-btn
            elevation="0"
            tile
            class="pr-2"
            color="transparent"
            height="30"
            x-small
            ripple
          >
            <v-badge
              :v-if="numberUsersOnTactic(item.id) > 0"
              right
              overlap
              color="primary"
              :content="numberUsersOnTactic(item.id)"
            >
              <v-icon color="grey darken-1">fa-user-circle</v-icon>
            </v-badge>
          </v-btn>
        </span>
      <a v-else>{{ item.name }}</a>
    </template>
    <template v-slot:append="{ item }">
      <v-menu
        offset-y
        nudge-left="100"
        nudge-width="80"
        content-class="elevation-2"
        v-if="!item.children"
      >
        <template v-slot:activator="{ on: menuItem }">
          <v-btn
            elevation="0"
            color="transparent"
            height="30"
            fab
            x-small
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
                  small
                  :color="tacticMenuColour(item.tactic, cardItem)"
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
import { Getter, namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { SocketTacticAction, SocketTacticGetters } from '@/store/modules/socket/tactic'
import { Collection, Tactic } from '@/store/types'
import { TacticMenuItem, TacticMenuOptions, TreeViewItem } from '@/components/entity-panel/sections/components/tacticSelector/types'
import { EventBus } from '@/event-bus'
import { SocketUserGetters } from '@/store/modules/socket/user'

const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)
const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'TacticSelectorContent'
})
export default class TacticSelectorContent extends Vue {
  @Getter(`${Namespaces.SOCKET_TACTIC}/${SocketTacticGetters.COLLECTIONS}`) collections!: Collection[]
  @Getter(`${Namespaces.SOCKET_TACTIC}/${SocketTacticGetters.TACTICS}`) tactics!: Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.PINNED_TACTICS) pinnedTactics!: Tactic[]
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED) isAuthorised!: boolean;
  @SocketTactic.Action(SocketTacticAction.DELETE_TACTIC) deleteTactic!: (id: string) => void
  @SocketTactic.Action(SocketTacticAction.UPDATE_TACTIC) updateTactic!: (tactic: Tactic) => void
  @SocketTactic.Action(SocketTacticAction.TOGGLE_PIN_TACTIC) togglePinTactic!: (tactic: Tactic) => void
  active = []
  open: string[] = []
  search: string | null = null
  selected = []

  get items (): TreeViewItem[] {
    const collections: TreeViewItem[] = this.collections.map((collection: Collection) => {
      const tactics: Tactic[] = this.tactics.filter((tactic: Tactic) => tactic.collectionId === collection.id)
      return {
        id: collection.id,
        name: collection.name,
        parent: collection.parentCollectionId,
        children: tactics.map((tactic: Tactic) => {
          return {
            parent: tactic.collectionId,
            id: tactic.id,
            name: tactic.name,
            tactic: tactic,
            icon: tactic.map.icon || 'fa-map'
          }
        })
      }
    })
    collections.forEach((collection: TreeViewItem) => {
      if (collection.parent) {
        const parent = collections.find((parent: TreeViewItem) => parent.id === collection.parent)
        if (parent && parent.children) {
          parent.children.push(collection)
        }
      }
    })
    return collections[0].children || []
  }

  switchTactic (id: string) {
    const tactic: Tactic | undefined = this.tactics.find((tactic: Tactic) => tactic.id === id)
    if (tactic) {
      EventBus.$emit('setTactic', tactic)
    }
  }
  // eslint-disable-next-line
  numberUsersOnTactic (id: string) {
    return 1
  }

  tacticMenuOnClickHandler (menuItem: TacticMenuItem, tactic: Tactic) {
    switch (menuItem.action) {
      case TacticMenuOptions.EDIT:
        EventBus.$emit('openManageTacticsOverlay', tactic)
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
  tacticMenuColour (tactic: Tactic, item: TacticMenuItem) {
    if (item.action === TacticMenuOptions.PIN && tactic.pinned) {
      return 'primary'
    } else if (item.action === TacticMenuOptions.DELETE) {
      return 'error'
    }
    return ''
  }
  tacticMenuIcon (tactic: Tactic, item: TacticMenuItem) {
    return item.icon
  }
  tacticMenuPinText (tactic: Tactic, item: TacticMenuItem) {
    if (item.action === TacticMenuOptions.PIN && tactic.pinned && item.titleTwo) {
      return item.titleTwo
    }
    return item.title
  }
  cardMenuItems: TacticMenuItem[] = [{
    action: TacticMenuOptions.EDIT,
    title: `Edit Tactic`,
    icon: 'fa-edit'
  }, {
    action: TacticMenuOptions.PIN,
    title: `Pin Tactic`,
    titleTwo: `Unpin Tactic`,
    icon: 'fa-bookmark'
  }, {
    action: TacticMenuOptions.DELETE,
    title: `Delete Tactic`,
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
</style>
