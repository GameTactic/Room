<template>
  <v-chip
    :color="entity.color || 'blue'"
    label
    filter
    filter-icon="fa fa-check"
    light
    class="pa-2 custom-entity-chip"
    @click.stop="onClickHandler"
  >
    <div class="custom-entity-chip-content">
      <span>
        <span :title="entity.name" class="white--text custom-entity-chip-text">{{ entity.name }}</span>
      </span>
      <span>
        <v-avatar>
          <img :src="entity.image" />
        </v-avatar>
        <v-chip v-if="entity.tier" x-small dark pill>T-{{entity.tier}}</v-chip>
      </span>
    </div>
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

.custom-entity-chip-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-entities-container .custom-entity-chip {
  width: 45%;
}

.custom-entity-chip-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
</style>

<style lang="scss">
.custom-entity-chip {
  height: 45px !important;
  >span {
    width: 100%;
  }
  .v-icon {
    font-size: 14px;
    color: white !important;
    padding-left: 3px;
  }
}

</style>
