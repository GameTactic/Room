<template>
  <v-btn-toggle class="flex-column btn-toggle-box">
    <Popout-button :id="id" icon="fa-mouse" tool="ping" :popout="false" />
    <!--<Popout-button :id="id" icon="fa-pen"/> -->
  </v-btn-toggle>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import PopoutButton from './buttons/PopoutButton.vue'

@Component({
  name: 'MapButtons',
  components: {
    PopoutButton
  }
})
export default class MapButtons extends Vue {
  @Prop() private id!: string;
}
</script>
<style scoped lang="scss">
.btn-toggle-box{
  margin: 0.25rem;
  position: fixed;
}
</style>
