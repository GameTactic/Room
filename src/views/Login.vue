<template>
  <div>
    <the-nav :id="id" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TheNav from '@/components/navigation/TheNav.vue'

  @Component({
    name: 'Login',
    components: {
      TheNav
    }
  })
export default class extends Vue {
    @Prop() id!: string
}
</script>

<style scoped>

</style>
