<template>
  <v-btn
    dark
    icon
    style="margin-right:2px"
    v-if="!mobile && !isAuth"
    @click="doOpen"
  >
    Login
    <v-dialog v-model="dialogOpen" @click:outside="dialogOpen = false"
              max-width="300px">
      <LoginCard></LoginCard>
    </v-dialog>
  </v-btn>
  <v-menu v-else-if="!mobile && isAuth" offset-y>
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
        <span>User profile</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item @click="logout">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
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
    <v-list-item v-if="isAuth" @click="logout">
      <v-list-item-title>Logout</v-list-item-title>
    </v-list-item>
    <v-list-item v-else @click="doOpen">
      <v-list-item-title>Login</v-list-item-title>
      <v-dialog v-model="dialogOpen" @click:outside="dialogOpen = false" fullscreen>
        <LoginCard></LoginCard>
      </v-dialog>
    </v-list-item>
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
  import {Component, Prop, Vue} from 'vue-property-decorator'
  import {namespace} from 'vuex-class'
  import {Namespaces} from '@/store'
  import {AuthenticationActions, AuthenticationGetters} from '@/store/modules/authentication'
  import LoginCard from '@/components/navigation/LoginCard.vue'

  const authNamespace = namespace(Namespaces.AUTH)

  interface UserMenuItem {
    text: string;
    title: string;
  }

  @Component({
    name: 'TheUserMenu',
    components: {LoginCard}
  })
  export default class TheUserMenu extends Vue {
    @authNamespace.Getter(AuthenticationGetters.IS_AUTH) isAuth!: boolean
    @authNamespace.Action(AuthenticationActions.LOGIN_WG) authenticate!: (region: string) => void;
    @authNamespace.Action(AuthenticationActions.LOGOUT) logout!: () => void

    @Prop() private mobile!: boolean

    dialogOpen = false

    doOpen() {
      setTimeout(() => {
        this.dialogOpen = true
      })
    }

    userMenuItems: UserMenuItem[] = []

    // eslint-disable-next-line
    userMenuItemsClickHandler(item: UserMenuItem) {
      // do stuff
    }
  }

</script>
<style scoped lang="scss">

</style>
