<template>
  <v-list>
    <span class="mx-2 caption" v-if="owner">Owner [1]</span>
    <v-divider class="mx-2" v-if="owner"></v-divider>
    <UserListItem :user="owner" v-if="owner"></UserListItem>
    <span class="mx-2 caption" v-if="admins.length > 0">Admin [{{ admins.length }}]</span>
    <v-divider class="mx-2" v-if="admins.length > 0"></v-divider>
    <UserListItem
      v-for="user in admins"
      :key="user.id"
      :user="user"
    ></UserListItem>
    <span class="mx-2 caption" v-if="users.length > 0">Member [{{ users.length }}]</span>
    <v-divider class="mx-2" v-if="users.length > 0"></v-divider>
    <UserListItem
      v-for="user in users"
      :key="user.id"
      :user="user"
    ></UserListItem>
    <span class="mx-2 caption" v-if="offlineUsers.length > 0">Offline [{{ offlineUsers.length }}]</span>
    <v-divider class="mx-2" v-if="offlineUsers.length > 0"></v-divider>
    <UserListItem
      v-for="user in offlineUsers"
      :key="user.id"
      :user="user"
    ></UserListItem>
  </v-list>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { Role, RoleTypes, User } from '@/store/types'
import { SocketUserGetters } from '@/store/modules/socket/user'
import { Namespaces } from '@/store'
import { namespace } from 'vuex-class'
import UserListItem from '@/components/entity-panel/sections/components/userList/UserListItem.vue'

const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'UserListContent',
  components: {
    UserListItem
  }
})
export default class UserListContent extends Vue {
  @SocketUser.Getter(SocketUserGetters.ONLINE_USERS) onlineUsers!: User[]
  @SocketUser.Getter(SocketUserGetters.OFFLINE_USERS) offlineUsers!: User[]

  get owner (): User | undefined {
    return this.onlineUsers.find((user: User) => user.roles.find((role: Role) => role.roleTypes === RoleTypes.ROOM_OWNER))
  }

  get admins (): User[] {
    const admins = this.onlineUsers.filter((user: User) => user.roles.find((role: Role) => role.roleTypes === RoleTypes.ADMIN))
    return admins.filter((user: User) => !user.roles.find((role: Role) => role.roleTypes === RoleTypes.ROOM_OWNER))
  }

  get users (): User[] {
    const members = this.onlineUsers.filter((user: User) => user.roles.find((role: Role) => role.roleTypes === RoleTypes.USER))
    return members.filter((user: User) => !user.roles.find((role: Role) => role.roleTypes === RoleTypes.ROOM_OWNER))
      .filter((user: User) => !user.roles.find((role: Role) => role.roleTypes === RoleTypes.ADMIN))
  }
}
</script>

<style scoped>

</style>
