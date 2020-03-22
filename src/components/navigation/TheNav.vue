<template>
  <div>
    <the-nav-extra-large class="the-nav-extra-large" :id="id"/>
    <the-nav-small class="the-nav-small" :id="id"/>
    <the-nav-extra-small class="the-nav-extra-small" :id="id"/>
  </div>
</template>

<script lang="ts">
import TheNavExtraLarge from '@/components/navigation/TheNavExtraLarge.vue'
import TheNavSmall from '@/components/navigation/TheNavSmall.vue'
import TheNavExtraSmall from '@/components/navigation/TheNavExtraSmall.vue'
import { Component, Prop, Vue } from 'vue-property-decorator'

  @Component({
    name: 'the-nav',
    components: {
      TheNavExtraLarge,
      TheNavSmall,
      TheNavExtraSmall
    }
  })
export default class extends Vue {
    @Prop() id!: string
}
</script>
<style scoped lang="scss">

  @media (max-width: 575px) {
    .the-nav-extra-large, .the-nav-small {
      display: none;
    }
  }

  @media (min-width: 576px) and (max-width: 1199px) {
    .the-nav-extra-large, .the-nav-extra-small {
      display: none;
    }
  }

  @media (min-width: 1200px) {
    .the-nav-small, .the-nav-extra-small {
      display: none;
    }
  }
</style>
