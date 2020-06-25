<template>
  <span>
    <span class="ml-2 caption" v-text="`${getRoleType()} [${users.length}]`" />
    <v-divider class="mx-2" />
    <v-list-item
      v-for="user in users"
      :key="user.id"
      class="pl-4 pr-2"
    >
      <v-list-item-avatar size="30" class="ma-0 mr-2">
        <v-tooltip v-if="online" nudge-bottom="20" top>
          <template v-slot:activator="{ on: tooltip }">
            <v-badge
              bordered
              bottom
              color="green"
              dot
              offset-x="20"
              offset-y="20"
            >
              <v-avatar v-on="{ ...tooltip }">
                <v-icon>fa-user-circle</v-icon>
              </v-avatar>
            </v-badge>
          </template>
          <span>Online</span>
        </v-tooltip>
        <v-avatar v-else>
          <v-icon small>fa-user-circle</v-icon>
        </v-avatar>
      </v-list-item-avatar>
      <v-list-item-content class="body-2">
        {{ user.name }}
      </v-list-item-content>
      <v-list-item-action class="ma-0">
        <v-btn fab text small>
          <v-icon small class="grey--text darken-2">fa-ellipsis-v</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </span>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import { User, RoleTypes } from '@/store/types'

@Component({
  name: 'UserListItem'
})
export default class UserListItem extends Vue {
  @Prop() private users!: User[]
  @Prop() private type!: RoleTypes
  @Prop() private online!: boolean

  // enum
  RoleTypes = RoleTypes

  getRoleType () {
    switch (this.type) {
      case RoleTypes.ROOM_OWNER: return 'Room Owners'
      case RoleTypes.ADMIN: return 'Admins'
      case RoleTypes.USER: return 'Users'
      default: return ''
    }
  }
}
</script>
