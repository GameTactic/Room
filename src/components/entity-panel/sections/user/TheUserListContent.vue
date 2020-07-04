<template>
  <v-list class="pa-0">
    <user-list-item v-if="owners.length" :users="owners" :type="RoleTypes.ROOM_OWNER" :online="true" />
    <user-list-item v-if="admins.length" :users="admins" :type="RoleTypes.ADMIN" :online="true" />
    <user-list-item v-if="users.length" :users="users" :type="RoleTypes.USER" :online="true" />
    <user-list-item v-if="offlineOwners.length" :users="offlineOwners" :type="RoleTypes.ROOM_OWNER" />
    <user-list-item v-if="offlineAdmins.length" :users="offlineAdmins" :type="RoleTypes.ADMIN"/>
    <user-list-item v-if="offlineUsers.length" :users="offlineUsers" :type="RoleTypes.USER"/>
  </v-list>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { Role, RoleTypes, User } from '@/store/types'
import { SocketUserGetters } from '@/store/modules/socket/user'
import { Namespaces } from '@/store'
import { namespace } from 'vuex-class'
import UserListItem from './UserListItem.vue'

const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'TheUserListContent',
  components: {
    UserListItem
  }
})
export default class TheUserListContent extends Vue {
  @SocketUser.Getter(SocketUserGetters.ONLINE_USERS) allOnlineUsers!: User[]
  @SocketUser.Getter(SocketUserGetters.OFFLINE_USERS) allOfflineUsers!: User[]
  // enum
  RoleTypes = RoleTypes

  get owners (): User[] {
    return this.allOnlineUsers.filter((user: User) => user.roles.find((role: Role) => role.roleTypes === RoleTypes.ROOM_OWNER))
  }

  get offlineOwners (): User[] {
    return this.allOfflineUsers.filter((user: User) => user.roles.find((role: Role) => role.roleTypes === RoleTypes.ROOM_OWNER))
  }

  get admins (): User[] {
    return this.allOnlineUsers.filter((user: User) => user.roles.find((role: Role) => role.roleTypes === RoleTypes.ADMIN))
  }

  get offlineAdmins (): User[] {
    return this.allOfflineUsers.filter((user: User) => user.roles.find((role: Role) => role.roleTypes === RoleTypes.ADMIN))
  }

  get users (): User[] {
    return this.allOnlineUsers.filter((user: User) => user.roles.find((role: Role) => role.roleTypes === RoleTypes.USER))
  }

  get offlineUsers (): User[] {
    return this.allOfflineUsers.filter((user: User) => user.roles.find((role: Role) => role.roleTypes === RoleTypes.USER))
  }
}
</script>

<style scoped>

</style>
