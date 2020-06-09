<template>
  <v-list dense>
    <v-list-item v-for="user in users" :key="user.jti">
      <v-list-item-content>{{ user.name }}</v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { User } from '@/store/types'
import { Prop } from 'vue-property-decorator'

@Component({
  name: 'UserList'
})
export default class UserList extends Vue {
  @Prop() private users!: User[]
}
</script>
<style lang="scss" scoped>

</style>
