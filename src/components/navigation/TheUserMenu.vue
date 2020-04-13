<template>
  <v-menu v-if="!mobile" offset-y>
    <template v-slot:activator="{ on: menu }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            dark
            icon
            style="margin-right:2px"
            v-on="{ ...tooltip, ...menu }"
          >
            <v-icon size="20">fa-user-circle</v-icon>
          </v-btn>
        </template>
        <span>Sign in / Sign out</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item
        v-for="(userMenuItem, index) in userMenuItems"
        :key="index"
        :title="userMenuItem.title"
        @click="userMenuItemsClickHandler(userMenuItem)"
      >
        <v-list-item-title>{{ userMenuItem.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
  <v-list v-else dense style="width: 100%;">
    <v-subheader>User Profile</v-subheader>
    <v-list-item
      v-for="item in userMenuItems"
      :key="item.text"
      link
    >
      <v-list-item-content>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
// eslint-disable-next-line
import { Component, Prop, Vue } from 'vue-property-decorator'

interface UserMenuItem {
  text: string;
  title: string;
}

@Component({
  name: 'TheUserMenu'
})
export default class TheUserMenu extends Vue {
  @Prop() private mobile!: boolean;
  userMenuItems: UserMenuItem[] = [{
    text: 'Login',
    title: 'Login to save your progress'
  }, {
    text: 'Logout',
    title: 'Logout of your logged in account'
  }]

  // eslint-disable-next-line
  userMenuItemsClickHandler (item: UserMenuItem) {
    // do stuff
  }
}

</script>
<style scoped lang="scss">

</style>
