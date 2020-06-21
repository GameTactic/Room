<template>
  <v-list-item
    class="px-0"
  >
    <v-list-item-avatar class="mr-0">
      <v-icon>
        fa-user
      </v-icon>
    </v-list-item-avatar>
    <v-list-item-content>
      <v-list-item-title>
        {{ entity.name }}
        <v-chip small>{{ entity.tier }}</v-chip>
      </v-list-item-title>
    </v-list-item-content>
    <v-list-item-action>
      <v-btn icon>
        <v-icon
          color="grey"
          size="15px"
        >fa-ellipsis-v</v-icon>
      </v-btn>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import { Ship } from '@/types/Games/Wows'

@Component({
  name: 'WowsTeamSectionItem'
})
export default class WowsTeamItem extends Vue {
  @Prop() private entity!: Ship
}
</script>

<style scoped>

</style>
