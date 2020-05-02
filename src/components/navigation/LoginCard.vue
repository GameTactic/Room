<template>
  <v-card class="login-card">
    <v-card-title class="login-card-title">Select a login option</v-card-title>
    <v-card-text>
      <ProviderBlock v-for="(provider, name) in providers" :provider-name="name" :provider="provider" :key="name">
      </ProviderBlock>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { AuthenticationActions, AuthenticationGetters } from '@/store/modules/authentication'
import { Providers } from '@/util/ProvidersUtil'
import ProviderBlock from '@/components/navigation/login/ProviderBlock.vue'

const authNamespace = namespace(Namespaces.AUTH)

  @Component({
    name: 'LoginCard',
    components: {
      ProviderBlock
    }
  })
export default class extends Vue {
    @authNamespace.Action(AuthenticationActions.LOGIN_WG) authenticate!: (endpoint: string) => void
    @authNamespace.Getter(AuthenticationGetters.PROVIDERS) providers!: Providers
}
</script>

<style scoped>
  .login-card-title {
    font-weight: bold;
  }
</style>
