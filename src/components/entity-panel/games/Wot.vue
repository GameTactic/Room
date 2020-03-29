<template>
  <div>WOT</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'WOT'
})
export default class Wot extends Vue {
  @Prop() private clickedItem!: string;
}
</script>

<style scoped lang="scss">

</style>
