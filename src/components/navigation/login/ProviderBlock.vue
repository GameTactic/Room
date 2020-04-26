<template>
    <div>
      <h3>{{providerName}}</h3>
      <v-divider>
      </v-divider>
      <v-btn v-for="entry of entries" @click="authenticate(entry.endpoint)" :key="entry.key">
        {{entry.key}}
      </v-btn>
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

</style>
