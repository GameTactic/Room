<template>
 <div>Test</div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import TeamListItem from '../TeamListItem.vue'

@Component({
  name: 'TheTeamListContent',
  components: {
    TeamListItem
  }
})
export default class TheTeamListContent extends Vue {

}
</script>

<style lang="scss">
.custom-text-field-wows .v-text-field__details {
  display: none;
}
</style>
