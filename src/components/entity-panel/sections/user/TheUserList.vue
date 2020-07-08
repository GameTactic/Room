<template>
  <accordion-item icon="fa-user-plus">
    <template v-slot:header>
      {{ `${$t('user.title')} [${onlineUsers.length}]` }}
    </template>
    <template v-slot:content>
      <the-user-list-content />
    </template>
  </accordion-item>
</template>

<script lang="ts">

import Component from 'vue-class-component'
import Vue from 'vue'
import AccordionItem from '../AccordionItem.vue'
import { SocketUserGetters } from '@/store/modules/socket/user'
import { User } from '@/store/types'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import TheUserListContent from './TheUserListContent.vue'

const SocketUser = namespace(Namespaces.SOCKET_USER)

@Component({
  name: 'TheUserList',
  components: {
    AccordionItem,
    TheUserListContent
  }
})
export default class TheUserList extends Vue {
  @SocketUser.Getter(SocketUserGetters.ONLINE_USERS) onlineUsers!: User[]
}
</script>

<style lang="scss" scoped>
</style>
