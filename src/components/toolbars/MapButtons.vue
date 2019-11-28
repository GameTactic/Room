<template>
  <side-toolbar>
    <Popout-button :id="id" icon="fa-mouse"/>
    <Popout-button :id="id" icon="fa-pen"/>
  </side-toolbar>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import PopoutButton from '../buttons/PopoutButton.vue'
import SideToolbar from './SideToolbar.vue'

@Component({
  name: 'MapButtons',
  components: {
    SideToolbar,
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
