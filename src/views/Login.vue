<template>
  <div class="login-form">
    <v-content>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card elevation="12">
              <v-toolbar class="login-form-toolbar" color="primary" flat>
                <v-toolbar-title>Login</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <h4>Please select a realm to log in with</h4>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" :click="authEU" depressed>
                  EU
                </v-btn>
                <v-btn color="primary" :click="authNA" depressed>
                  NA
                </v-btn>
                <v-btn color="primary" :click="authASIA" depressed>
                  ASIA
                </v-btn>
                <v-btn color="primary" :click="authRU" depressed>
                  CIS
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { AuthenticationActions, JWTRegion } from '@/store/modules/authentication'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'

const authNamespace = namespace(Namespaces.AUTH)

  @Component({
    name: 'Login'
  })
export default class extends Vue {
    @Prop() id!: string
    @authNamespace.Action(AuthenticationActions.LOGIN_WG) authenticate!: (region: string) => void;

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

<style scoped lang="scss">
</style>
