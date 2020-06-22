<template>
  <v-chip
    :color="entity.color || 'blue'"
    small
    label
    class="px-2"
    @click.stop="onClickHandler"
  >
    <v-avatar>
      <img :src="entity.image" />
    </v-avatar>
    <span class="white--text">{{ entity.name }}</span>
  </v-chip>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { Namespaces } from '@/store'
import { namespace } from 'vuex-class'
import { AppToolGetters, AppToolsAction } from '@/store/modules/app/tools'
import { Tool } from '@/tools/Tool'
import { Entity } from '@/store/types'
import EntityClass from '@/tools/Entity'
import { AdditionTools } from '@/types/Canvas'

const AppTools = namespace(Namespaces.APP_TOOLS)

@Component({
  name: 'EntitySelectorItem'
})
export default class EntitySelectorItem extends Vue {
  @Prop() private entity!: Entity
  @AppTools.Getter(AppToolGetters.ENABLED_TOOL) enabledTool!: Tool
  @AppTools.Action(AppToolsAction.ENABLE_TOOL) enableTool!: (tool: string) => void
  @AppTools.Action(AppToolsAction.DISABLE_TOOL) disableTool!: () => void

  onClickHandler () {
    if (this.enabledTool && this.enabledTool.name === AdditionTools.ENTITY) {
      const entity: Entity | undefined = (this.enabledTool as EntityClass).getEntity()
      if (entity && entity.id === this.entity.id) {
        this.enabledTool.setEntity(undefined)
        this.disableTool()
      } else {
        (this.enabledTool as EntityClass).setEntity(this.entity)
      }
    } else {
      this.enableTool(AdditionTools.ENTITY)
      if (this.enabledTool && this.enabledTool instanceof EntityClass) {
        this.enabledTool.setEntity(this.entity)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.custom-entity-chip-active {
  font-weight: bold;
}
</style>
