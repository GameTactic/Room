<template>
  <accordion-item>
    <template v-slot:header>
      Users [{{ onlineUsers.length }}]
    </template>
    <template v-slot:rightBtn>
      <v-btn
        text
        light
        icon
        class="custom-add-button ml-3"
        @click.stop=""
      >
        <v-icon
          color="white"
          size="20px"
        >
          fa-user-plus
        </v-icon>
      </v-btn>
    </template>
    <template v-slot:content>
      <UserListContent></UserListContent>
    </template>
  </accordion-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import AccordionItem from '@/components/entity-panel/templates/AccordionItem.vue'
import UserListContent from '@/components/entity-panel/sections/components/userList/UserListContent.vue'
import { SocketUserGetters } from '@/store/modules/socket/user'
import { User } from '@/store/types'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'

const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'UserList',
  components: {
    AccordionItem,
    UserListContent
  }
})
export default class UserList extends Vue {
  @SocketUser.Getter(SocketUserGetters.ONLINE_USERS) onlineUsers!: User[]
}
</script>

<style lang="scss" scoped>
</style>
