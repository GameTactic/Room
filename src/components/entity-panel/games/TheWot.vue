<template>
  <div>WOT</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'TheWot'
})
export default class TheWot extends Vue {
  @Prop() private clickedItemKey!: number;
}
</script>

<style scoped lang="scss">

</style>
