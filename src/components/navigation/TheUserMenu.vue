<template>
  <v-menu
    v-if="!isSM && isAuth"
    offset-y
    content-class="elevation-2"
  >
    <template v-slot:activator="{ on: menu }">
      <v-tooltip bottom :open-delay="500">
        <template v-slot:activator="{ on: tooltip }">
          <v-btn
            color="primary"
            elevation="0"
            small
            style="margin-right:2px"
            v-on="{ ...tooltip, ...menu }"
          >
            <v-icon size="20">fa-user-circle</v-icon>
          </v-btn>
        </template>
        <span>{{ $t('user.profile') }}</span>
      </v-tooltip>
    </template>
    <v-list>
      <v-list-item v-if="isAuth" @click="onClickLogout">
        <v-list-item-title>{{ $t('navigation.login.logout') }}</v-list-item-title>
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
  <v-btn
    v-else-if="!isSM && !isAuth"
    color="primary"
    elevation="0"
    small
    @click.stop="onClickOpenLoginDialog"
  >
    {{ $t('navigation.login.title') }}
    <v-dialog
      v-model="isDialogOpen"
      max-width="500px"
      @click:outside="onClickCloseLoginDialog"
    >
      <the-login-card />
    </v-dialog>
  </v-btn>
  <v-list v-else dense style="width: 100%;">
    <v-subheader v-text="$t('user.profile')" />
    <v-list-item v-if="isAuth" @click="onClickLogout">
      <v-list-item-title>{{ $t('navigation.login.logout') }}</v-list-item-title>
    </v-list-item>
    <v-list-item v-else @click.stop="onClickOpenLoginDialog">
      <v-list-item-title>{{ $t('navigation.login.title') }}</v-list-item-title>
      <v-dialog
        v-model="isDialogOpen"
        fullscreen
        @click:outside="onClickCloseLoginDialog"
      >
        <the-login-card :is-mobile="isSM" v-on:close-handler="onClickCloseLoginDialog" />
      </v-dialog>
    </v-list-item>
    <v-list-item
      v-for="item in userMenuItems"
      :key="item.text"
      link
    >
      <v-list-item-content>
        <v-list-item-title v-text="item.text" />
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { AppAuthenticationActions, AppAuthenticationGetters } from '@/store/modules/app/authentication'
import TheLoginCard from '@/components/navigation/TheLoginCard.vue'

const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)

interface UserMenuItem {
  text: string;
  title: string;
}

@Component({
  name: 'TheUserMenu',
  components: { TheLoginCard }
})
export default class TheUserMenu extends Vue {
  @Prop() private isSM!: boolean;
  @AppAuthentication.Getter(AppAuthenticationGetters.IS_AUTH) isAuth!: boolean
  @AppAuthentication.Action(AppAuthenticationActions.LOGIN_WG) authenticate!: (region: string) => void;
  @AppAuthentication.Action(AppAuthenticationActions.LOGOUT) onClickLogout!: () => void

  isDialogOpen = false
  userMenuItems: UserMenuItem[] = []

  onClickOpenLoginDialog () {
    this.isDialogOpen = true
  }

  onClickCloseLoginDialog () {
    this.isDialogOpen = false
  }
  // eslint-disable-next-line
  userMenuItemsClickHandler(item: UserMenuItem) {
    // do stuff
  }
}

</script>
<style scoped lang="scss">

</style>
