<template>
  <v-dialog v-model="overlay" width="500">
    <v-card class="pa-12">
      <h2 v-text="$t('user.overlay.inviteFriends')" />
      <v-select
        :v-model="expireAfter"
        :items="expireAfterItems"
        :label="$t('user.overlay.expireAfter')"
        prepend-icon="far fa-clock"
      >
        <template v-slot:item="{ item }">
          <span :value="item.value" v-text="$t(item.text)" />
        </template>
        <template v-slot:selection="{ item }">
          <span v-text="$t(item.text)" />
        </template>
      </v-select>
      <v-select
        v-model="maxNumberUsers"
        :items="maxNumberUsersItems"
        :label="$t('user.overlay.maxNumberUsers')"
        prepend-icon="fa-users"
      >
        <template v-slot:item="{ item }">
          <span :value="item.value" v-text="$t(item.text)" />
        </template>
        <template v-slot:selection="{ item }">
          <span v-text="$t(item.text)" />
        </template>
      </v-select>
      <v-btn
        small
        color="primary"
        v-text="$t('user.overlay.generateLink')"
      />
      <v-text-field
        id="generatedLink"
        v-model="generatedLink"
        readonly
      >
        <template v-slot:append>
          <v-btn
            :class="['ma-1', isLinkCopied ? 'custom-hide-copy-check-button' : '']"
            color="primary"
            :disabled="!generatedLink"
            @click="copyLinkOnClickHandler"
            v-text="$t('user.overlay.copyLink')"
          />
          <v-btn
            :class="['ma-1', !isLinkCopied ? 'custom-hide-copy-check-button' : '']"
            color="success"
          >
            <v-icon>fas fa-check</v-icon>
          </v-btn>
        </template>
      </v-text-field>
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { EventBus } from '@/event-bus'
import { OpenOverlayList } from './types'

type SelectItem = {
  text: string | number;
  value: string | number;
}

@Component({
  name: 'TheInviteUserOverlay'
})
export default class TheInviteUserOverlay extends Vue {
  overlay = false
  generatedLink = ''
  isLinkCopied = false
  expireAfterItems: SelectItem[] = [{
    text: 'user.overlay.thirtyMins',
    value: '30,'
  }, {
    text: 'user.overlay.oneHour',
    value: '1h'
  }, {
    text: 'user.overlay.sixHours',
    value: '6h'
  }, {
    text: 'user.overlay.12Hours',
    value: '12h'
  }, {
    text: 'user.overlay.oneDay',
    value: '1day'
  }, {
    text: 'user.overlay.never',
    value: 'never'
  }]

  maxNumberUsersItems: SelectItem[] = [{
    text: 'user.overlay.unlimited',
    value: 'unlimited'
  }, {
    text: 'user.overlay.oneUse',
    value: '1'
  }, {
    text: 'user.overlay.fiveUses',
    value: '5'
  }, {
    text: 'user.overlay.tenUses',
    value: '10'
  }, {
    text: 'user.overlay.twentyFiveUses',
    value: '25'
  }, {
    text: 'user.overlay.fiftyUses',
    value: '50'
  }, {
    text: 'user.overlay.hundredUses',
    value: '100'
  }]

  expireAfter = this.expireAfterItems[0].value
  maxNumberUsers = this.maxNumberUsersItems[0].value

  created () {
    EventBus.$on(OpenOverlayList.OPEN_THE_INVITE_USER_OVERLAY, () => {
      this.overlay = true
    })
  }

  copyLinkOnClickHandler () {
    const copedLink: HTMLInputElement | null = document.querySelector('#generatedLink')
    if (copedLink) {
      copedLink.setAttribute('type', 'text')
      copedLink.select()

      try {
        document.execCommand('copy')
        this.isLinkCopied = true
        setTimeout(() => {
          this.isLinkCopied = false
        }, 5000)
      } catch (err) {
        this.isLinkCopied = false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-hide-copy-check-button {
  display: none;
}
</style>
