<template>
  <div class="entity-panel-container">Text</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  name: 'EntityPanel'
})
export default class MapButtons extends Vue {
  @Prop() private id!: string;
}
</script>
<style scoped lang="scss">
.entity-panel-container {
  background-color: white;
}
</style>
