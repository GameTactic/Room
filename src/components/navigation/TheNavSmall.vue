<template>
  <v-row class="navbar-row">
    <v-col cols="12">
      <v-toolbar dense class="navbar-toolbar-left">
        <v-icon color="#FFFFFF">fa-anchor</v-icon>
        <h2>GameTactic</h2>
        <v-spacer />
        <v-btn dark icon title="Save your room">
          <v-icon>fa-save</v-icon>
        </v-btn>
        <the-room-menu />
        <the-user-menu />
      </v-toolbar>
    </v-col>
    <v-col cols="12">
      <v-toolbar dense flat class="navbar-toolbar-center justify-center">
        <v-spacer />
        <div>Tactic editing tools</div>
        <v-spacer />
      </v-toolbar>
     </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TheRoomMenu from './TheRoomMenu.vue'
import TheUserMenu from './TheUserMenu.vue'

@Component({
  name: 'TheNavSmall',
  components: {
    TheRoomMenu,
    TheUserMenu
  }
})
export default class TheNavSmall extends Vue {
  @Prop() private id!: string;
}
</script>
<style scoped lang="scss">
.navbar-row {
  margin: 0px;
   div {
    padding: 0px;
  }
}

header.navbar-toolbar-left.navbar-toolbar-left.navbar-toolbar-left {
  background-color: $room-navbar;
  color: $room-navbar-text;
  position: relative;
  flex: 0 1 100px;
  z-index: 100;
  h2 {
    white-space: nowrap;
    margin: 0.25rem;
  }
  &:after {
    content: '';
    position: absolute;
    right: -96px;
    top: 0px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 48px 48px;
    border-color: transparent transparent transparent $room-navbar;
  }
}

.navbar-toolbar-center {
  color: black;
}

.navbar-toolbar-right.navbar-toolbar-right.navbar-toolbar-right {
  background-color: $room-navbar;
  color: $room-navbar-text;
  position: relative;
  flex: 0 1 250px;
  z-index: 100;
  &:after {
    content: '';
    position: absolute;
    left: -48px;
    top: 0;
    width: 0;
    height: 0;
    border-style: solid;
    border-width:  48px 0px 0px 48px;
    border-color: $room-navbar transparent;
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
