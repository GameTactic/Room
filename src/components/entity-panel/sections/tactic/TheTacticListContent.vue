<template>
  <span v-if="!items.length" class="caption px-2" v-text="$t('tactic.noTacticsFound')"/>
  <v-treeview
    v-else
    :active="[currentTacticId]"
    :items="items"
    class="pa-0"
    dense
    open-on-click
    activatable
    @update:active.passive="switchTactic"
  >
    <template v-slot:prepend="{ item, isOpen, active }">
      <v-icon
        v-if="item.children"
        @click="active && $event.stopPropagation()"
      >
        {{ isOpen ? 'fa-folder-open' : 'fa-folder' }}
      </v-icon>
      <v-avatar
        size="30"
        class="ml-0 pl-0"
        @click="active && $event.stopPropagation()"
      >
        <img :src="item.tactic.map.icon">
      </v-avatar>
    </template>
    <template v-slot:label="{ item, active }">
      <span
        v-if="!item.children"
        :title="item.name"
        class="d-flex justify-space-between align-center"
        @click="active && $event.stopPropagation()"
      >
          <span class="d-flex flex-column custom-tactic-content">
            <span class="body-2" >
            <v-icon
              v-if="item.tactic.lockedBy"
              :title="$t('tactic.locked')"
              x-small
              class="pr-1"
            >
              fa-lock
            </v-icon>
            <v-icon
              v-if="item.tactic.isPinned"
              :title="$t('tactic.pinned')"
              x-small
              class="pr-1"
            >
              fa-bookmark
            </v-icon>
            <span v-text="item.name" />
            </span>
            <span :title="item.tactic.map.name" class="caption" v-text="item.tactic.map.name" />
          </span>
        </span>
      <a v-else @click="active && $event.stopPropagation()">{{ item.name }}</a>
    </template>
    <template v-slot:append="{ item: item }">
      <span>
        <v-menu
          v-if="!item.children"
          offset-y
          nudge-left="80"
          nudge-width="80"
          content-class="elevation-2"
        >
          <template v-slot:activator="{ on: usersOnTactic }">
            <v-btn
              v-if="getUsersOnTactic(item.id).length"
              :width="30"
              elevation="0"
              tile
              icon
              class="mr-1 px-0"
              color="transparent"
              ripple
              v-on="usersOnTactic"
              @click.stop=""
            >
              <v-badge
                :v-if="getUsersOnTactic(item.id).length"
                :content="getUsersOnTactic(item.id).length"
                offset-x="12"
                offset-y="15"
                overlap
                right
                color="primary"
              >
                <v-icon dense color="grey darken-1">far fa-user</v-icon>
              </v-badge>
            </v-btn>
          </template>
          <v-card tile>
            <v-list dense>
              <v-list-item v-for="user in getUsersOnTactic(item.id)" :key="user.id">
                <v-list-item-content>
                  <v-list-item-title v-text="user.name" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
      </span>
      <entity-menu
        v-if="!item.children"
        :item="item.tactic"
        :cardMenuItems="cardMenuItems"
        :isMenuItemVisible="isTacticMenuVisible"
        :menuOnClickHandler="tacticMenuOnClickHandler"
        :getMenuIconColour="tacticMenuIconColour"
        :getMenuIcon="tacticMenuIcon"
        :getMenuText="tacticMenuText"
      />
    </template>
  </v-treeview>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { SocketTacticAction, SocketTacticGetters } from '@/store/modules/socket/tactic'
import { Collection, Tactic, User, ToggleLockTactic, DuplicateTactic } from '@/store/types'
import { MenuItem, TacticMenuOptions, TreeViewItem } from '../../types'
import { EventBus } from '@/event-bus'
import { SocketUserGetters } from '@/store/modules/socket/user'
import HandleTactic from '@/util/handleTactic'
import { OpenOverlayList } from '@/components/overlays/types'
import { AppAuthenticationGetters, ExtendedJWT } from '@/store/modules/app/authentication'
import EntityMenu from '../EntityMenu.vue'

const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)
const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)
const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'TheTacticListContent',
  components: {
    EntityMenu
  }
})
export default class TheTacticListContent extends Vue {
  @AppAuthentication.Getter(AppAuthenticationGetters.JWT) jwt!: ExtendedJWT
  @SocketTactic.Getter(SocketTacticGetters.COLLECTIONS) collections!: Collection[]
  @SocketTactic.Getter(SocketTacticGetters.TACTICS) tactics!: Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.PINNED_TACTICS) pinnedTactics!: Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.CURRENT_TACTIC_ID) currentTacticId!: string
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED) isAuthorised!: boolean;
  @SocketUser.Getter(SocketUserGetters.ONLINE_USERS) onlineUsers!: User[];
  @SocketUser.Getter(SocketUserGetters.USERS) users!: User[];
  @SocketTactic.Action(SocketTacticAction.DELETE_TACTIC) deleteTactic!: (id: string) => void
  @SocketTactic.Action(SocketTacticAction.UPDATE_TACTIC) updateTactic!: (tactic: Tactic) => void
  @SocketTactic.Action(SocketTacticAction.DUPLICATE_TACTIC) duplicateTactic!: (payload: DuplicateTactic) => void
  @SocketTactic.Action(SocketTacticAction.TOGGLE_PIN_TACTIC) togglePinTactic!: (tactic: Tactic) => void
  @SocketTactic.Action(SocketTacticAction.TOGGLE_LOCK_TACTIC) toggleLockTactic!: (payload: ToggleLockTactic) => void

  cardMenuItems: MenuItem[] = [{
    action: TacticMenuOptions.EDIT,
    title: 'tactic.edit',
    icon: 'fa-edit'
  }, {
    action: TacticMenuOptions.LOCK,
    title: 'tactic.lock',
    titleTwo: 'tactic.unlock',
    icon: 'fa-lock',
    iconTwo: 'fa-lock-open'
  }, {
    action: TacticMenuOptions.DUPLICATE,
    title: 'tactic.duplicate',
    icon: 'far fa-clone'
  }, {
    action: TacticMenuOptions.PIN,
    title: 'tactic.pin',
    titleTwo: 'tactic.unpin',
    icon: 'fa-bookmark',
    iconTwo: 'far fa-bookmark'
  }, {
    action: TacticMenuOptions.DELETE,
    title: 'tactic.delete',
    icon: 'fa-times'
  }]

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

  isTacticMenuVisible (tactic: Tactic, cardItem: MenuItem) {
    if (cardItem.action !== TacticMenuOptions.LOCK || (cardItem.action === TacticMenuOptions.LOCK && tactic.createdBy === this.jwt.jti)) {
      return true
    }
    return false
  }

  switchTactic (ids: string[]) {
    const tactic: Tactic | undefined = this.tactics.find((tactic: Tactic) => tactic.id === ids[0])
    if (tactic) {
      new HandleTactic(tactic).setLocal()
    }
  }

  getUsersOnTactic (tactic: Tactic): User[] {
    return this.onlineUsers.filter((onlineUser: User) => onlineUser.onTacticId === tactic.id)
  }

  tacticMenuOnClickHandler (tactic: Tactic, menuItem: MenuItem) {
    if (tactic) {
      switch (menuItem.action) {
        case TacticMenuOptions.EDIT:
          EventBus.$emit(OpenOverlayList.OPEN_THE_UPDATE_TACTIC_OVERLAY, tactic)
          break
        case TacticMenuOptions.LOCK:
          this.toggleLockTactic({ tacticId: tactic.id, jti: this.jwt.jti })
          break
        case TacticMenuOptions.DUPLICATE:
          this.duplicateTactic({ tactic, jti: this.jwt.jti })
          break
        case TacticMenuOptions.DELETE:
          break
        case TacticMenuOptions.PIN:
          this.togglePinTactic(tactic)
          break
        default:
          break
      }
    }
  }

  tacticMenuIconColour (tactic: Tactic, menuItem: MenuItem) {
    if (menuItem.action === TacticMenuOptions.DELETE) {
      return 'error'
    }
    return 'primary'
  }

  tacticMenuIcon (tactic: Tactic, menuItem: MenuItem) {
    if (menuItem.titleTwo && menuItem.action === TacticMenuOptions.PIN && tactic.isPinned) {
      return menuItem.iconTwo
    }
    if (menuItem.titleTwo && menuItem.action === TacticMenuOptions.LOCK && tactic.lockedBy) {
      return menuItem.iconTwo
    }
    return menuItem.icon
  }

  tacticMenuText (tactic: Tactic, item: MenuItem) {
    if (item.titleTwo && item.action === TacticMenuOptions.PIN && tactic.isPinned) {
      return this.$t(item.titleTwo)
    }
    if (item.titleTwo && item.action === TacticMenuOptions.LOCK && tactic.lockedBy) {
      return this.$t(item.titleTwo)
    }
    return this.$t(item.title)
  }

  getUserNameFromJTI (jti: string) {
    return this.users.find((user: User) => user.jti === jti)?.name ?? ''
  }
}
</script>
<style lang="scss" scoped>
.custom-tactic-content {
  overflow: hidden;
  >span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
<style lang="scss">
.v-treeview-node__level{
  width: 12px !important;
}
.custom-autocomplete-tactic-menu-icon {
  margin-right: 6px !important;
}

.custom-expansion-panel-content {
  .v-treeview-node__content {
    margin-left: 0px;
  }
  .v-treeview-node__append {
    margin-left: 0px;
  }
  .v-treeview-node__root {
    padding-left: 0;
    padding-right: 4px;
  }
}
</style>
