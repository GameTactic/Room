<template>
  <v-badge
    :content="noOfEntitiesOnCanvas"
    :value="noOfEntitiesOnCanvas > 0"
    color="primaryShade"
    overlap
    offset-x="20"
    offset-y="20"
    class="custom-entity-card-badge"
  >
    <v-card
      :class="['custom-entity-card my-1', active ? 'custom-entity-card-active' : '']"
      :data-tier="entity.tier"
      :data-type="entity.type"
      :data-image="entity.image"
      :title="entity.title"
      elevation="0"
      @click.stop="onClickHandler"
    >
      <v-container class="pa-1">
        <v-row class="text-center mx-0">
          <v-col cols="12" class="pa-0 custom-entity-card-column">
            <img :style="{backgroundColor: entity.color}" :src="entity.image" class="custom-entity-card-image">
          </v-col>
          <v-col cols="12" class="pa-0">
            <div class="caption custom-entity-card-text">{{entity.name}}</div>
            <v-chip
              v-if="entity.tier"
              x-small
              pill
              class="ma-0"
              v-text="convertNumberToRomanNumeral(entity.tier)"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-badge>
</template>
<script lang="ts">
import Vue from 'vue'
import { Prop } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { GameEntity } from '@/types/games'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { AppToolGetters, AppToolsAction } from '@/store/modules/app/tools'
import { Tool } from '@/tools/tool'
import { AdditionTools } from '@/types/canvas'
import EntityClass from '@/tools/entity'
import { Entity } from '@/store/types'
import { convertNumberToRomanNumeral } from '@/games/utils'

const AppTools = namespace(Namespaces.APP_TOOLS)

@Component({
  name: 'EntityCard'
})
export default class EntityCard extends Vue {
  @Prop() private entity!: GameEntity;
  @Prop() private active!: boolean;
  @Prop() private noOfEntitiesOnCanvas!: number;
  @AppTools.Getter(AppToolGetters.ENABLED_TOOL) enabledTool!: Tool | undefined
  @AppTools.Action(AppToolsAction.ENABLE_TOOL) enableTool!: (tool: string) => void
  @AppTools.Action(AppToolsAction.DISABLE_TOOL) disableTool!: () => void

  // util method
  convertNumberToRomanNumeral = convertNumberToRomanNumeral

  onClickHandler () {
    if (this.enabledTool?.name === AdditionTools.ENTITY) {
      const entity: Entity | undefined = (this.enabledTool as EntityClass).getEntity()
      if (entity?.id === this.entity.id) {
        this.enabledTool.setEntity(undefined)
        this.disableTool()
      } else {
        (this.enabledTool as EntityClass).setEntity(this.entity)
      }
    } else {
      this.enableTool(AdditionTools.ENTITY)
      if (this.enabledTool instanceof EntityClass) {
        this.enabledTool.setEntity(this.entity)
      }
    }
    this.$emit('click', this.entity)
  }
}
</script>
<style lang="scss" scoped>
.custom-default-entities-container .custom-entity-card-badge  {
  width: 25%;
  .custom-entity-card {
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border: 1px solid lightgrey;
    &:hover{
      border: 1px solid $room-primary;
    }
    &:focus:before {
      opacity: 0;
    }
  }
}

.custom-entities-container .custom-entity-card-badge  {
  width: 33%;
  .custom-entity-card {
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border: 1px solid lightgrey;
    &:hover {
      border: 1px solid $room-primary;
    }
    &:focus:before {
      opacity: 0;
    }
  }
}

.custom-entity-card-image {
  border-radius: 50%;
  filter: opacity(0.75);
}

.custom-entity-card-column {
  margin-bottom: -2px;
}

.custom-entity-card-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.custom-entity-card {
  border: 1px solid lightgrey;
}

.custom-entities-container .custom-entity-card-active, .custom-default-entities-container .custom-entity-card-active{
  border: 1px solid $room-primary;
  &::before {
    opacity: 0.09;
  }
}
</style>
<style lang="scss">
.custom-entity-card-badge .v-badge__badge {
  z-index: 1;
}
</style>
