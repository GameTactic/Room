<template>
  <v-list-item>
    <v-list-item-avatar>
      <v-tooltip nudge-bottom="20" top v-if="isOnline">
        <template v-slot:activator="{ on }">
          <v-badge
            bordered
            bottom
            color="green"
            dot
            offset-x="20"
            offset-y="20"
          >
            <v-avatar v-on="on">
              <v-icon>fa-user-circle</v-icon>
            </v-avatar>
          </v-badge>
        </template>
        <span>Online</span>
      </v-tooltip>
      <v-avatar v-else>
        <v-icon>fa-user-circle</v-icon>
      </v-avatar>
    </v-list-item-avatar>
    <v-list-item-content>
      {{ user.name }}
    </v-list-item-content>
    <v-list-item-action>
      <v-btn
        fab
        text
        x-small
      >
        <v-icon class="grey--text darken-2">fa-ellipsis-v</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import { User } from '@/store/types'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { SocketUserGetters } from '@/store/modules/socket/user'

const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'UserListItem'
})
export default class UserListItem extends Vue {
  @SocketUser.Getter(SocketUserGetters.ONLINE_USERS) onlineUsers!: User[]
  @Prop() private user!: User

  get isOnline (): boolean {
    return this.onlineUsers.includes(this.user)
  }
}
</script>

<style scoped>

</style>
