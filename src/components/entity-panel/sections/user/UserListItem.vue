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
          <span v-text="$t('user.online')"/>
        </v-tooltip>
        <v-avatar v-else>
          <v-icon small>fa-user-circle</v-icon>
        </v-avatar>
      </v-list-item-avatar>
      <v-list-item-content class="body-2">
        {{ user.name }}
      </v-list-item-content>
      <v-list-item-action class="ma-0">
        <entity-menu
          :item="user"
          :cardMenuItems="cardMenuItems"
          :isMenuItemVisible="isMenuItemVisibleHandler"
          :menuOnClickHandler="userMenuOnClickHandler"
          :getMenuIconColour="getUserMenuColour"
          :getMenuIcon="getUserMenuIcon"
          :getMenuText="getUserMenuText"
        />
      </v-list-item-action>
    </v-list-item>
  </span>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import { User, RoleTypes, Role } from '@/store/types'
import { MenuItem, UserMenuOptions } from '../../types'
import EntityMenu from '../EntityMenu.vue'

@Component({
  name: 'UserListItem',
  components: {
    EntityMenu
  }
})
export default class UserListItem extends Vue {
  @Prop() private users!: User[]
  @Prop() private type!: RoleTypes
  @Prop() private online!: boolean

  cardMenuItems: MenuItem[] = [{
    action: UserMenuOptions.MANAGE_ROLES,
    title: 'user.menu.manageRoles',
    icon: 'fa-edit'
  }, {
    action: UserMenuOptions.BAN,
    title: 'user.menu.ban',
    icon: 'fa-ban'
  }]

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

  userMenuOnClickHandler (user: User, menuItem: MenuItem) {
    switch (menuItem.action) {
      case UserMenuOptions.MANAGE_ROLES: break
      case UserMenuOptions.BAN: break
      default: break
    }
  }

  getUserMenuColour (user: User, menuItem: MenuItem) {
    if (menuItem.action === UserMenuOptions.BAN) {
      return 'error'
    }
    return 'primary'
  }

  getUserMenuIcon (user: User, menuItem: MenuItem) {
    return menuItem.icon
  }

  getUserMenuText (user: User, menuItem: MenuItem) {
    return this.$t(menuItem.title)
  }

  isMenuItemVisibleHandler (user: User, menuItem: MenuItem) {
    if ((menuItem.action === UserMenuOptions.BAN || menuItem.action === UserMenuOptions.MANAGE_ROLES) &&
      !user.roles.find((role: Role) => role.roleTypes === RoleTypes.ROOM_OWNER || role.roleTypes === RoleTypes.ADMIN)) {
      return false
    }
    return true
  }
}
</script>
