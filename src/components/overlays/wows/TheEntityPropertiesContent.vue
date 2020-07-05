<template>
  <span>
    <div
      v-for="field in fields"
      :key="field.id"
    >
      <v-text-field
        :id="field.id"
        :value="getFieldValue(field)"
        :label="$t(field.label)"
        :placeholder="$t(field.placeholder)"
        :suffix="field.suffix"
        class="custom-text-field"
        outlined
        type="number"
        dense
        @change="onTextFieldChangeHandler(field, $event)"
      />
    </div>
  </span>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Field, GameEntity } from '@/types/games'

@Component({
  name: 'TheEntityPropertiesContent'
})
export default class TheEntityPropertiesContent extends Vue {
  @Prop() private readonly fields!: Field[]
  @Prop() private readonly selectedEntity!: GameEntity | null

  onTextFieldChangeHandler (field: Field, value: string) {
    if (this.selectedEntity) {
      this.selectedEntity.data[field.id] = Number(value)
    }
  }

  getFieldValue (field: Field) {
    if (this.selectedEntity) {
      return this.selectedEntity.data[field.id]?.toString()
    }
    return ''
  }
}
</script>
<style lang="scss">
.custom-text-field input{
  text-align: right;
}
</style>
