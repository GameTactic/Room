<template>
  <v-card>
    <v-card-title class="custom-login-card-title">
      <div v-text="$t('navigation.login.card.title')" />
      <v-btn icon @click="closeHandler" v-if="isSM">
        <v-icon v-text="'fa-times'" />
      </v-btn>
    </v-card-title>
    <v-card-text>
      <provider-block
        v-for="(provider, name) in providers"
        :provider-name="name"
        :provider="provider"
        :key="name"
      />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { AppAuthenticationActions, AppAuthenticationGetters } from '@/store/modules/app/authentication'
import { Providers } from '@/util/ProvidersUtil'
import ProviderBlock from '@/components/navigation/login/ProviderBlock.vue'
const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)
@Component({
  name: 'TheLoginCard',
  components: { ProviderBlock }
})
export default class TheLoginCard extends Vue {
  @Prop({ default: false }) isSM!: boolean
  @AppAuthentication.Action(AppAuthenticationActions.LOGIN_WG) authenticate!: (endpoint: string) => void
  @AppAuthentication.Getter(AppAuthenticationGetters.PROVIDERS) providers!: Providers
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
