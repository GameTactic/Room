<template>
  <v-treeview
    v-model="active"
    :items="this.items"
    open-on-click
    :open="open"
    activatable
  >
    <template v-slot:prepend="{ item, open }">
      <v-icon v-if="item.children">
        {{ open ? 'fa-folder-open' : 'fa-folder' }}
      </v-icon>
      <v-icon v-else>
        {{ item.icon }}
      </v-icon>
    </template>
    <template v-slot:label="{ item }">
      <span
        v-if="!item.children"
        @click="switchTactic(item.id)"
        class="d-flex justify-space-between align-center"
      >
          <span class="d-flex flex-column">
            <span class="body-2" v-text="item.name" />
            <span class="caption" v-text="item.map.name" />
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
      >
        <template v-slot:activator="{ on: menuItem }">
          <v-btn
            elevation="0"
            height="30"
            tile
            x-small
            ripple
            color="transparent"
            v-on="menuItem">
            <v-icon
              small
              color="grey darken-1"
            >fa-ellipsis-v</v-icon>
          </v-btn>
        </template>
        <p>{{ item.name }}</p>
      </v-menu>
    </template>
  </v-treeview>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { Getter } from 'vuex-class'
import { Namespaces } from '@/store'
import { SocketTacticGetters } from '@/store/modules/socket/tactic'
import { Collection, Tactic, Map } from '@/store/types'
import { EventBus } from '@/event-bus'

export interface TreeViewItem {
  id: string;
  name: string;
  icon?: string;
  parent?: string;
  children?: TreeViewItem[];
  map?: Map;
}

@Component({
  name: 'TacticSelectorContent'
})
export default class TacticSelectorContent extends Vue {
  @Getter(`${Namespaces.SOCKET_TACTIC}/${SocketTacticGetters.COLLECTIONS}`) collections!: Collection[]
  @Getter(`${Namespaces.SOCKET_TACTIC}/${SocketTacticGetters.TACTICS}`) tactics!: Tactic[]
  active = []
  open = []

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
            map: tactic.map,
            icon: 'fa-map'
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
}
</script>
<style lang="scss">
.v-treeview-node__level{
  width: 12px !important;
}
</style>
