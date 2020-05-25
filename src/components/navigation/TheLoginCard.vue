<template>
  <v-card>
    <v-card-title>Login</v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <h4>Please select a realm to log in with</h4>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="authEU" depressed>
        EU
      </v-btn>
      <v-btn color="primary" @click="authNA" depressed>
        NA
      </v-btn>
      <v-btn color="primary" @click="authASIA" depressed>
        ASIA
      </v-btn>
      <v-btn color="primary" @click="authRU" depressed>
        CIS
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { AppAuthenticationActions, JWTRegion } from '@/store/modules/app/authentication'

const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)

@Component({
  name: 'TheLoginCard'
})
export default class extends Vue {
  @AppAuthentication.Action(AppAuthenticationActions.LOGIN_WG) authenticate!: (region: string) => void;
  authEU () {
    this.authenticate(JWTRegion.EU)
  }
  authNA () {
    this.authenticate(JWTRegion.NA)
  }
  authASIA () {
    this.authenticate(JWTRegion.SA)
  }
  authRU () {
    this.authenticate(JWTRegion.RU)
  }
}
</script>
<style scoped>

</style>
