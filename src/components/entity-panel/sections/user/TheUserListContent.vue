<template>
  <v-list class="pa-0">
    <user-list-item v-if="getOnlineUsersByRole(RoleTypes.ROOM_OWNER).length" :users="getOnlineUsersByRole(RoleTypes.ROOM_OWNER)" :type="RoleTypes.ROOM_OWNER" :online="true" />
    <user-list-item v-if="getOnlineUsersByRole(RoleTypes.ADMIN).length" :users="getOnlineUsersByRole(RoleTypes.ADMIN)" :type="RoleTypes.ADMIN" :online="true" />
    <user-list-item v-if="getOnlineUsersByRole(RoleTypes.USER).length" :users="getOnlineUsersByRole(RoleTypes.USER)" :type="RoleTypes.USER" :online="true" />
    <user-list-item v-if="getOfflineUsersByRole(RoleTypes.ROOM_OWNER).length" :users="getOfflineUsersByRole(RoleTypes.ROOM_OWNER)" :type="RoleTypes.ROOM_OWNER" />
    <user-list-item v-if="getOfflineUsersByRole(RoleTypes.ADMIN).length" :users="getOfflineUsersByRole(RoleTypes.ADMIN)" :type="RoleTypes.ADMIN"/>
    <user-list-item v-if="getOfflineUsersByRole(RoleTypes.USER).length" :users="getOfflineUsersByRole(RoleTypes.USER)" :type="RoleTypes.USER"/>
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

  getOnlineUsersByRole (roleType: RoleTypes): User[] {
    return this.allOnlineUsers.filter((user: User) => user.roles.find((role: Role) => role.roleTypes === roleType))
  }

  getOfflineUsersByRole (roleType: RoleTypes): User[] {
    return this.allOfflineUsers.filter((user: User) => user.roles.find((role: Role) => role.roleTypes === roleType))
  }
}
</script>

<style scoped>

</style>
