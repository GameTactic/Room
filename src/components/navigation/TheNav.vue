<template>
  <span>
    <v-row>
      <v-col
        class="py-0 my-0 pr-0 custom-left-col"
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
        class="py-0 my-0 custom-center-col d-none d-md-flex"
      >
        <v-toolbar class="custom-nav-center" dense flat>
            <the-canvas-tools v-if="isAuthorisedCanvasLoaded" />
        </v-toolbar>
      </v-col>
      <v-col
        class="py-0 my-0 pl-0 custom-right-col"
      >
        <v-toolbar
          class="custom-nav-right"
          dense
          flat
          color="primary"
        >
          <the-room-save />
          <span class="d-none d-sm-flex">
            <the-presentation-mode />
            <the-manage-room />
            <the-user-menu />
            <v-btn
              class="mr-2"
              :disabled="!isAuthorised"
              icon
              small
              @click.stop="$emit('entityPanelOpen')"
            >
              <v-icon size="20" color="white">fa-bars</v-icon>
            </v-btn>

          </span>
          <span class="d-flex d-sm-none">
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
          class="d-flex d-md-flex"
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
    <v-row>
      <v-col class="py-0 my-0 justify-self-center custom-canvas-tools-column">
        <the-canvas-tools v-if="isAuthorisedCanvasLoaded" class="d-flex d-md-none"/>
      </v-col>
    </v-row>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import TheRoomSave from './buttons/TheRoomSave.vue'
import ThePresentationMode from './buttons/ThePresentationMode.vue'
import TheManageRoom from './buttons/TheManageRoom.vue'
import TheUserMenu from './TheUserMenu.vue'
import TheCanvasTools from '@/components/canvas-tools/TheCanvasTools.vue'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { SocketUserGetters } from '@/store/modules/socket/user'

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
  @SocketUser.Getter(SocketUserGetters.IS_AUTHORISED) isAuthorised!: boolean
  drawer = false
}
</script>
<style scoped lang="scss">
.custom-canvas-tools-column {
  z-index: 1;
}

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
  z-index: 2;
}

.custom-isSM-navigation-drawer-close {
  justify-content: flex-end;
}

@media screen and (min-width: 960px) {
  .custom-left-col, .custom-right-col {
    z-index: 5;
    max-width: 300px;
  }
}

@media screen and (min-width: 600px) {
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
}

</style>

<style lang="scss">
.custom-nav-left>div {
  padding-left: 0.5rem;
  z-index: 10;
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
  z-index: 10;
  padding-left: 0px;
  padding-right: 0px;
  justify-content: flex-end;
}
</style>
