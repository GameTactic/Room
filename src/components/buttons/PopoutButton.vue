<template>
  <v-menu
    transition="slide-x-transition"
    offset-x
    :nudge-width="200"
  >
    <template v-slot:activator="{ on }">
      <v-btn v-on="on" style="color: white;">
        <v-icon>{{icon}}</v-icon>
      </v-btn>
    </template>
    <v-card>
      Content for pop out
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class PopoutButton extends Vue {
  @Prop() private id!: string;
  @Prop() private icon!: string;
}

</script>
<style scoped lang="scss">

</style>
