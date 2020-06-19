<template>
  <v-row>
    <v-col
      class="py-0 my-0 custom-left-col"
      :cols="6"
      :sm="3"
      :lg="2"
      :order="0"
    >
      <v-toolbar
        class="custom-nav-left"
        dense
        flat
        color="primary"
      >
        <v-img max-width="160" max-height="45" :src="require('@/assets/logo.png')" />
      </v-toolbar>
    </v-col>
    <v-col
      class="py-0 my-0"
      :cols="12"
      :sm="6"
      :lg="8"
      :order="2"
      :order-sm="1"
    >
      <v-toolbar class="custom-nav-center" dense flat>
          <the-canvas-tools v-if="isAuthorisedCanvasLoaded" class="d-none d-md-flex" />
          <the-canvas-tools v-if="isAuthorisedCanvasLoaded" class="d-flex d-md-none" :isSM="true"/>
      </v-toolbar>
    </v-col>
    <v-col
      class="py-0 my-0"
      :cols="6"
      :sm="3"
      :lg="2"
      :order="1"
      :order-sm="2"
    >
      <v-toolbar
        class="custom-nav-right"
        dense
        flat
        color="primary"
      >
        <the-room-save />
        <span class="d-none d-lg-flex">
          <the-presentation-mode />
          <the-manage-room />
          <the-user-menu />
        </span>
        <span class="d-flex d-lg-none">
          <v-btn
            class="mr-2"
            icon
            @click.stop="drawer = !drawer"
          >
            <v-icon color="white">fa-bars</v-icon>
          </v-btn>
        </span>
      </v-toolbar>
      <v-navigation-drawer
        v-model="drawer"
        absolute
        right
        temporary
        class="d-flex d-sm-flex"
      >
        <v-list>
          <v-list-item class="custom-isSM-navigation-drawer-close">
          <v-btn
            icon
            @click="drawer = false"
          >
            <v-icon color="primary">fa-times</v-icon>
          </v-btn>
          </v-list-item>
          <v-list-item>
            <the-presentation-mode :isSM="true"/>
          </v-list-item>
          <v-list-item>
            <the-manage-room :isSM="true"/>
          </v-list-item>
          <v-divider />
          <v-list-item>
            <the-user-menu :isSM="true" />
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheRoomSave from './buttons/TheRoomSave.vue'
import ThePresentationMode from './buttons/ThePresentationMode.vue'
import TheManageRoom from './buttons/TheManageRoom.vue'
import TheUserMenu from './TheUserMenu.vue'
import TheCanvasTools from './TheCanvasTools.vue'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { SocketUserGetters } from '../../store/modules/socket/user'

const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'TheNav',
  components: {
    TheRoomSave,
    ThePresentationMode,
    TheManageRoom,
    TheUserMenu,
    TheCanvasTools
  }
})
export default class TheNav extends Vue {
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED_CANVAS_LOADED) isAuthorisedCanvasLoaded!: boolean
  drawer = false
}
</script>
<style scoped lang="scss">
@mixin navAfter {
  content: '';
  background: $room-primary;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  -webkit-transform-origin: 100% 0;
  -ms-transform-origin: 100% 0;
  transform-origin: 100% 0;
  z-index: -1;
}

.custom-left-col {
  z-index: 1;
}

.custom-isSM-navigation-drawer-close {
  justify-content: flex-end;
}

.custom-nav-left:after {
  @include navAfter;
  right: -60px;
  -webkit-transform: skew(-45deg);
  -ms-transform: skew(-45deg);
  transform: skew(-45deg);
}

.custom-nav-right:after {
  @include navAfter;
  left: -60px;
  -webkit-transform: skew(45deg);
  -ms-transform: skew(45deg);
  transform: skew(45deg);
}
</style>

<style lang="scss">
.custom-nav-left>div {
  padding-left: 0.5rem;
}

.custom-nav-center {
  background-color: transparent !important;
  >div {
    justify-content: center;
    align-items: start;
    background-color: transparent;
  }
}

.custom-nav-right>div {
  padding-left: 0px;
  padding-right: 0px;
  justify-content: flex-end;
}
</style>
