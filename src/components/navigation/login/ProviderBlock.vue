<template>
  <div class="custom-provider-container">
    <h3 v-text="providerFormatted(providerName)" />
    <v-divider />
    <div class="custom-login-btn-container">
      <v-btn
        v-for="entry of entries"
        :key="entry.key"
        class="login-btn"
        color="primary"
        @click="login(entry.endpoint)"
      >
        {{ entry.key }}
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AppAuthenticationActions } from '@/store/modules/app/authentication'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { Provider, camelCaseToPascalCaseWithSpaces } from '@/util/providersUtil'

const appAuthentication = namespace(Namespaces.APP_AUTHENTICATION)

@Component({
  name: 'ProviderBlock'
})
export default class extends Vue {
  @Prop() providerName!: string
  @Prop() provider!: Provider
  @appAuthentication.Action(AppAuthenticationActions.LOGIN) login!: (endpoint: string) => void

  get entries () {
    return this.provider.entries
  }

  providerFormatted (sentence: string) {
    return camelCaseToPascalCaseWithSpaces(sentence)
  }
}
</script>

<style scoped lang="scss">
.custom-login-btn-container {
  margin-top: 5px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 5px;
}

.custom-provider-container {
  margin-top: 10px;
}
</style>
