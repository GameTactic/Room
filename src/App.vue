<template>
  <v-app id="app">
    <router-view/>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height:100vh;
  background-color: $room-background;
  font-size: $app-fontsize;
}
</style>
