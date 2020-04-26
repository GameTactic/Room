<template>
  <v-card>
    <v-card-title>Login</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <h4>Please select a realm to log in with</h4>
    </v-card-text>
    <v-card-actions>
      <ProviderBlock v-for="(provider, name) in providers" :provider-name="name" :provider="provider" :key="name">
      </ProviderBlock>
    </v-card-actions>
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

</style>
