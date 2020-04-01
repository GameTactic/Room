<template>
  <v-row class="navbar-row">
    <v-col cols="12">
      <v-toolbar dense class="navbar-toolbar-left">
        <v-img class="mx-8" max-width="160" max-height="45" :src="require('@/assets/logo.png')"></v-img>
        <v-spacer />
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              dark
              icon
              v-on="on"
            >
              <v-icon>fa-save</v-icon>
            </v-btn>
          </template>
          <span>Save room</span>
        </v-tooltip>
        <div>
          <the-room-menu />
          <the-user-menu />
        </div>
      </v-toolbar>
    </v-col>
    <v-col cols="12">
      <v-toolbar dense flat class="navbar-toolbar-center justify-center">
        <the-canvas-tools />
      </v-toolbar>
     </v-col>
  </v-row>
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
}
</script>
<style scoped lang="scss">
.navbar-row {
  margin: 0px;
  position: fixed;
   div {
    padding: 0px;
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
  }
}
.navbar-toolbar-right.navbar-toolbar-right.navbar-toolbar-right {
  background-color: $room-primary;
  color: $room-text;
  position: relative;
  flex: 0 1 250px;
  z-index: 100;
  > div {
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
