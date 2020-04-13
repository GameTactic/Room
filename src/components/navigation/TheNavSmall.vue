<template>
  <span>
    <v-row class="navbar-row custom-not-clickable">
      <v-col cols="12" class="custom-clickable">
        <v-toolbar dense class="navbar-toolbar-left">
          <v-img class="ml-3 mr-12" max-width="160" max-height="45" :src="require('@/assets/logo.png')"></v-img>
          <v-spacer />
          <div>
            <v-tooltip bottom nudge-bottom="10">
              <template v-slot:activator="{ on }">
                <v-btn
                  dark
                  icon
                  v-on="on"
                >
                  <v-icon size="20">fa-save</v-icon>
                </v-btn>
              </template>
              <span>Save room</span>
            </v-tooltip>
            <v-btn
              class="mr-2"
              icon
              @click.stop="drawer = !drawer"
            >
              <v-icon color="white">fa-bars</v-icon>
            </v-btn>
          </div>
        </v-toolbar>
      </v-col>
      <v-col cols="12">
        <v-toolbar dense flat class="navbar-toolbar-center justify-center custom-background-transparent">
          <the-canvas-tools class="custom-clickable" :mobile="true"/>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
      temporary
      class="custom-mobile-navigation-drawer"
    >
    <v-list>
      <v-list-item class="custom-mobile-navigation-drawer-close">
      <v-btn
        icon
        @click="drawer = false"
      >
        <v-icon color="primary">fa-times</v-icon>
      </v-btn>
      </v-list-item>
      <v-list-item>
        <the-room-menu :mobile="true" />
      </v-list-item>
      <v-divider />
      <v-list-item>
        <the-user-menu :mobile="true" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TheRoomMenu from './TheRoomMenu.vue'
import TheUserMenu from './TheUserMenu.vue'
import TheCanvasTools from './TheCanvasTools.vue'

@Component({
  name: 'TheNavSmall',
  components: {
    TheRoomMenu,
    TheUserMenu,
    TheCanvasTools
  }
})
export default class TheNavSmall extends Vue {
  @Prop() private id!: string;

  drawer = false
}
</script>
<style scoped lang="scss">
.navbar-row {
  margin: 0;
  position: fixed;
   div {
    padding: 0;
  }
}
header.navbar-toolbar-left.navbar-toolbar-left.navbar-toolbar-left {
  background-color: $room-primary;
  color: $room-text;
  position: relative;
  flex: 0 1 100px;
  z-index: 100;
  h2 {
    white-space: nowrap;
    margin: 0.25rem;
  }
}
.navbar-toolbar-center {
  color: black;
  >div {
    justify-content: center;
    align-items: start;
  }
}
.navbar-toolbar-right.navbar-toolbar-right.navbar-toolbar-right {
  background-color: $room-primary;
  color: $room-text;
  position: relative;
  flex: 0 1 250px;
  z-index: 100;
  >div {
    justify-content: flex-end;
    margin-right: 10px;
  }
}
@media screen and (max-width: 960px) {
  .navbar-toolbar-left, .navbar-toolbar-right  {
    flex: 1 1 auto;
    &:after {
      display: none;
    }
  }
}
</style>
<style lang=scss>
.custom-clickable {
  pointer-events: auto;
}
.custom-not-clickable {
  pointer-events: none;
}

.custom-mobile-navigation-drawer-close {
  justify-content: flex-end;
}
</style>
