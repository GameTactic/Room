<template>
  <v-tooltip
    v-if="!isSM"
    bottom
    nudge-bottom="10"
    :open-delay="500"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="!isItemEnabled"
        color="primary"
        elevation="0"
        small
        v-on="on"
        @click="manageRoomOnClickHandler"
      >
        <v-icon size="20">fa-home</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('navigation.navigation.manageRoom') }}</span>
  </v-tooltip>
  <v-list v-else dense style="width: 100%;">
    <v-list-item @click="manageRoomOnClickHandler">
      <v-list-item-title>{{ $t('navigation.navigation.manageRoom') }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { AppRoomGetters } from '@/store/modules/app/room'
import { Namespaces } from '@/store'
import { AppAuthenticationGetters } from '../../../store/modules/app/authentication'

const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)
const AppRoom = namespace(Namespaces.APP_ROOM)

@Component({
  name: 'TheManageRoom'
})
export default class TheManageRoom extends Vue {
  @Prop() readonly isSM!: boolean
  @AppRoom.Getter(AppRoomGetters.IS_CANVAS_LOADED) isCanvasLoaded!: boolean
  @AppAuthentication.Getter(AppAuthenticationGetters.IS_AUTH) isAuth!: boolean

  get isItemEnabled () {
    return this.isCanvasLoaded && this.isAuth
  }

  manageRoomOnClickHandler () {
    // Do something
  }
}
</script>
<style scoped lang="scss">
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
