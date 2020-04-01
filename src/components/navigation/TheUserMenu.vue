<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on: menu }">
      <v-tooltip bottom>
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            dark
            icon
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
