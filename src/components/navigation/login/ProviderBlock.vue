<template>
  <div>
    <h3>{{providerName}}</h3>
    <v-divider>
    </v-divider>
    <div class="login-btn-container">
      <v-btn v-for="entry of entries" @click="authenticate(entry.endpoint)" :key="entry.key"
             class="login-btn" color="primary">
        {{entry.key}}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import { AuthenticationActions } from '@/store/modules/authentication'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { Provider } from '@/util/ProvidersUtil'

const authNamespace = namespace(Namespaces.AUTH)

  @Component({
    name: 'ProviderBlock'
  })
export default class extends Vue {
    @Prop() providerName!: string
    @Prop() provider!: Provider
    @authNamespace.Action(AuthenticationActions.LOGIN_WG) authenticate!: (endpoint: string) => void

    get entries () {
      return this.provider.entries
    }
}
</script>

<style scoped lang="scss">
  .login-btn-container {
    margin-top: 5px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-column-gap: 5px;
  }
</style>
