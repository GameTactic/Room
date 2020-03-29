<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on }">
      <v-btn
        title="Login or Logout of your account"
        dark
        icon
        v-on="on"
      >
        <v-icon>fa-user-circle</v-icon>
      </v-btn>
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
import { Component, Prop, Vue } from 'vue-property-decorator'

interface UserMenuItem {
  text: string;
  title: string;
}

@Component({
  name: 'TheUserMenu'
})
export default class TheUserMenu extends Vue {
  @Prop() private id!: string;

  userMenuItems: UserMenuItem[] = [{
    text: 'Login',
    title: 'Login to save your progress'
  }, {
    text: 'Logout',
    title: 'Logout of your logged in account'
  }]

  userMenuItemsClickHandler (item: UserMenuItem) {
    // do stuff
  }
}

</script>
<style scoped lang="scss">

</style>
