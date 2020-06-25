<template>
  <v-list-item
    small
    label
    class="px-2 custom-entity-chip"
    dense
    @click.stop="onClickHandler"
  >
    <v-list-item-avatar
      :color="entity.color || 'blue'"
      size="30"
      class="my-0 rounded-circle"
    >
        <img :src="entity.image" />
    </v-list-item-avatar>
    <v-list-item-content>
      <span>{{ entity.name }}</span>
    </v-list-item-content>
  </v-list-item>
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
  name: 'EntityItem'
})
export default class EntityItem extends Vue {
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

<style lang="scss">
.custom-chip-group-wows-search .custom-entity-chip {
  width: 45%;
}
</style>
