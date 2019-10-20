<template>
  <v-btn-toggle class="flex-column btn-toggle-margin">
    <Popout-button :id="id" icon="fa-mouse"/>
    <Popout-button :id="id" icon="fa-pen"/>
  </v-btn-toggle>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import PopoutButton from './buttons/PopoutButton.vue'

@Component({
  name: 'App',
  components: {
    PopoutButton
  }
})
export default class MapButtons extends Vue {
  @Prop() private id!: string;
}
</script>
<style scoped lang="scss">
.btn-toggle-margin {
  margin: 0.5rem;
}
</style>
