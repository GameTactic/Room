<template>
  <v-menu
    transition="slide-y-reverse-transition"
    :close-on-content-click="false"
    :close-on-click="false"
    offset-y
    content-class="elevation-2 custom-user-menu-container"
    top
    ref="user"
  >
    <template v-slot:activator="{ on: menu }">
        <v-tooltip
          left
          :open-delay="500"
        >
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              :disabled="!isAuthorised"
              class="custom-user-selector-menu"
              color="primary"
              ripple
              tile
              icon
              width="48"
              large
              elevation="0"
              v-on="{ ...menu, ...tooltip }"
            >
              <v-badge
                color="primary"
                left
                :dot="!isAuthorised"
                :value="onlineUsers.length"
                :content="onlineUsers.length"
              >
                <v-icon dense v-text="'fa-user-friends'" />
              </v-badge>
            </v-btn>
          </template>
          <span v-text="$t(`user.button.tooltip`)" />
        </v-tooltip>
    </template>
    <v-card tile class="custom-user-menu-card">
      <v-sheet class="pa-1 d-flex" tile>
        <v-tabs
          v-model="tab"
          color="primary"
          fixed-tabs
          height="28"
        >
          <v-tab
            v-for="userTab in userTabs"
            :key="userTab.filter"
          >
            <v-badge
              offset-y="17"
              offset-x="-5"
              color="primary"
              :content="userTab.filter === 'online' ? onlineUsers.length : offlineUsers.length"
              :value="userTab.filter === 'online' ? onlineUsers.length : offlineUsers.length"
            >
              {{ $t(userTab.title) }}
            </v-badge>
          </v-tab>
        </v-tabs>
      </v-sheet>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="userTab in userTabs"
          :key="userTab.filter"
        >
          <v-card flat>
            <v-subheader v-if="userTab.filter === 'online' && !onlineUsers.length" v-text="$t('user.noUsersOnline')" />
            <span v-else-if="userTab.filter === 'online' && onlineUsers.length">
              <user-list :users="onlineUsers" />
            </span>
            <v-subheader v-else-if="userTab.filter === 'offline' && !offlineUsers.length" v-text="$t('user.noUsersOffline')" />
            <span v-else>
              <user-list :users="offlineUsers" />
            </span>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-menu>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import UserList from './UserList.vue'
import { namespace } from 'vuex-class'
import { User, RoleTypes } from '@/store/types'
import { SocketUserGetters, SocketUserAction } from '@/store/modules/socket/user'
import { Namespaces } from '@/store'

interface UserTab {
  title: string;
  filter: 'online' | 'offline';
}

const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'TheUserPanel',
  components: { UserList }
})
export default class TheUserPanel extends Vue {
  @SocketUser.Getter(SocketUserGetters.ONLINE_USERS) onlineUsers!: User[]
  @SocketUser.Getter(SocketUserGetters.OFFLINE_USERS) offlineUsers!: User[]
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED) isAuthorised!: boolean
  @SocketUser.Action(SocketUserAction.SET_USER) setUser!: (user: User) => void

  created () {
    this.setUser({
      jti: '8675fc95-879f-11ea-b26d-aad5b912f032',
      name: 'BeardedGaming',
      onTacticId: '1',
      isOnline: true,
      lastOnline: new Date(),
      roles: [{
        id: '1',
        roleTypes: RoleTypes['USER'],
        assignedBy: '8675fc95-879f-11ea-b26d-aad5b912f032'
      }]
    })
  }

  tab = null
  userTabs: UserTab[] = [{
    title: 'user.userTab.online',
    filter: 'online'
  }, {
    title: 'user.userTab.offline',
    filter: 'offline'
  }]
}
</script>
<style lang="scss" scoped>
.custom-user-selector-menu {
  position: fixed;
  bottom: 0px;
  width: 100%;
  right: 2px;
  background-color: white;
  border: 2px solid rgba(0, 0, 0, 0.12);
}

.custom-user-menu-container {
  left: calc(100% - 304px) !important;
}

.custom-user-menu-card {
  height: 300px;
  width: 300px;
}
</style>
