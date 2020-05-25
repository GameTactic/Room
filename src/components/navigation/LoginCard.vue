<template>
  <v-card class="login-card">
    <v-card-title class="custom-login-card-title">
      <div>{{ $t('navigation.login.card.title') }}</div>
      <v-btn icon @click="closeHandler" v-if="isMobile">
        <v-icon>fa-times</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <provider-block v-for="(provider, name) in providers"
                     :provider-name="name" :provider="provider" :key="name">
      </provider-block>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
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
    @Prop({ default: false }) isMobile!: boolean

    @Emit() closeHandler () {
      return null
    }
}
</script>

<style scoped>
  .custom-login-card-title {
      font-weight: bold;
      display: flex;
      justify-content: space-between;
    }
</style>
