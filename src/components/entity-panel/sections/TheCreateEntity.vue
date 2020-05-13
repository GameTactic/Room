<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    left
    transition="slide-x-reverse-transition"
    content-class="custom-menu-content-class"
    absolute
    :nudge-left="10"
    :nudge-top="10"
    offset-x
    @update:return-value="menuOnMinimiseHandler"
  >
    <template v-slot:activator="{ on: showEntityFields }">
      <v-chip-group
        v-on="showEntityFields"
        mandatory
        light
        class="custom-chip-group"
        :style="`border-bottom: 2px solid ${chipColour}`"
      >
        <v-chip
          v-for="team in teams"
          :background-color="team.color"
          active-class="custom-chip-active-class"
          filter
          label
          outlined
          :key="`chip-${team.key}`"
          @click="chipOnClickHandler(team.color)"
        >
          <v-icon :color="team.color">fa-users</v-icon>
        </v-chip>
      </v-chip-group>
      <v-container class="pa-1">
        <v-row
          v-if="entityData.length"
          class="custom-entity-card-row"
        >
          <v-col align="center" :cols="12" class="pb-1">
            <v-autocomplete
              :items="entityData"
              :search-input.sync="search"
              class="body-1"
              color="primary"
              hide-no-data
              append-icon="mdi-menu-down"
              dense
              eager
              clearable
              clear-icon="mdi-close"
              cache-items
              hide-selected
              :label="$t('entity.create.wows.autocomplete.label')"
              :placeholder="$t('entity.create.wows.autocomplete.placeholder')"
              prepend-icon="mdi-magnify"
              autocomplete="new-password"
              return-object
              @change="autoCompleteOnChangeHandler"
            >
              <template v-slot:item="data">
                <v-list-item-avatar size="29" class="custom-list-item-avatar">
                  <img :src="data.item.image">
                </v-list-item-avatar>
                <v-list-item-content class="custom-list-item-content">
                  <v-list-item-title v-text="data.item.text"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-autocomplete>
          </v-col>
          <v-row class="custom-entity-card-container">
            <v-col
              v-for="entity in updatedEntities"
              :key="entity.value"
              align-self="center"
              :cols="4"
              class="px-2 pb-2"
            >
              <v-badge
                overlap
                color="transparent"
                offset-x="30"
                :value="entityCardHover === entity.value"
              >
                <template v-slot:badge>
                  <v-menu offset-y nudge-left="20">
                    <template v-slot:activator="{ on: menuItem }">
                      <v-btn
                        icon
                        ripple
                        small
                        v-on="menuItem"
                        @mouseover="entityCardOnMouseHoverHandler(entity.value)"
                      >
                        <v-icon small>fa-ellipsis-v</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item
                        v-for="(item, index) in cardMenuItems"
                        :key="index"
                        class="custom-entity-card-list-item"
                        @click="cardMenuOnClickHandler(entity, item.action)"
                      >
                        <v-icon
                          small
                          :color="item.action === 'delete' ? 'primary' : ''"
                          :title="item.title"
                          v-text="item.icon"
                        />
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
                <v-card
                  v-if="entityData.length"
                  class="custom-entity-card"
                  tile
                  draggable
                  @dragstart="onDragStartHandler({ ...entity }, $event)"
                  @mouseover="entityCardOnMouseHoverHandler(entity.value)"
                >
                  <v-badge
                    overlap
                    left
                    color="transparent"
                    offset-x="30"
                    :value="entityCardHover === entity.value"
                  >
                    <template v-slot:badge>
                      <v-btn
                        icon
                        v-on="showEntityFields"
                        :disabled="isEntityPropertiesShown"
                        ripple
                        small
                        @click="entityCardOnEditHandler(entity)"
                      >
                        <v-icon small>fa-edit</v-icon>
                      </v-btn>
                    </template>
                    <v-card
                      v-if="entityData.length"
                      class="custom-entity-card"
                      raised
                      tile
                      draggable="false"
                      @mouseover="entityCardOnMouseHoverHandler(entity.value)"
                    >
                      <v-container class="pa-1">
                        <v-row class="text-center mx-0">
                          <v-col cols="12" class="pa-0">
                            <img class="custom-entity-card-image" width="40" :src="entity.image">
                          </v-col>
                          <v-col cols="12" class="pa-0">
                            <div class="caption">{{entity.shortText}}</div>
                            <v-chip v-if="entity.tier" x-small pill>T-{{entity.tier}}</v-chip>
                          </v-col>
                        </v-row>
                      </v-container>
                    </v-card>
                  </v-badge>
                </v-card>
              </v-badge>
            </v-col>
          </v-row>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <v-skeleton-loader
              type="list-item-avatar"
            />
          </v-col>
          <v-col
            v-for="i in 4"
            :key="i"
          >
            <v-skeleton-loader
              width="90"
              height="90"
              type="card"
              tile
            />
          </v-col>
        </v-row>
        <v-subheader>
          <p class="caption" v-html="$t('entity.cards.note')"></p>
        </v-subheader>
      </v-container>
    </template>
    <v-sheet
      flat
      tile
      elevation="0"
      class="pa-3"
      width="200"
    >
      <div
        v-for="(field, index) in fields"
        :key="field.id"
      >
        <v-text-field
          v-if="!field.hide"
          :id="field.id"
          :value="field.value"
          :label="$t(field.label)"
          :placeholder="$t(field.placeholder)"
          :suffix="$t(field.suffix)"
          class="custom-text-field"
          outlined
          dense
          @change="onTextFieldChangeHandler(entities, selectedEntityId, field, $event)"
        />
        <div v-if="index === fields.length -1" class="caption"><b>Note</b> Changes are saved automatically</div>
      </div>
    </v-sheet>
  </v-menu>
</template>
<script lang="ts">
import { Prop } from 'vue-property-decorator'
import Component from 'vue-class-component'
import { Item, Field } from '@/types/Games/Index'
import { MenuItem } from '@/components/TheEntityPanel.vue'
import Games from '@/mixins/Games'
import { GameName } from '@/store/modules/room'
import EntityCard from '../EntityCard.vue'

@Component({
  name: 'TheCreateEntity',
  mixins: [Games],
  components: {
    EntityCard
  }
})
export default class TheCreateEntity extends Games {
  @Prop() private clickedItemKey!: number;
  @Prop() private teams!: MenuItem[];
  @Prop() private entityData!: Item[];
  @Prop() private entities!: Item[];
  @Prop() private fields!: Field[];
  @Prop() private game!: GameName;
  @Prop() private autoCompleteOnChangeHandler!: (shipItem: Item) => void

  chipColour = 'green'
  entityCardHover = 0
  selectedEntityId = -1
  search = ''
  menu = false
  cardMenuItems = [{
    action: 'delete',
    title: `Remove ${this.game === 'wows' ? 'Ship' : 'Tank'}`,
    icon: 'fa-times'
  }]
  isEntityPropertiesShown = false
  shipIcons = {
    Battleship: require('@/assets/games/wows/icons/Battleship.svg'),
    AirCarrier: require('@/assets/games/wows/icons/AirCarrier.svg'),
    Cruiser: require('@/assets/games/wows/icons/Cruiser.svg'),
    Destroyer: require('@/assets/games/wows/icons/Destroyer.svg')
  }

  get updatedEntities (): Item[] {
    return this.entities
  }

  set updatedEntities (newValue: Item[]) {
    this.entities = newValue
    this.$emit('update:entities', newValue)
  }

  menuOnMinimiseHandler () {
    this.isEntityPropertiesShown = false
  }

  cardMenuOnClickHandler (clickedEntity: Item, action: string) {
    if (action === 'delete') {
      this.$emit('update:entities', [...this.entities].filter((entity: Item) => entity.value !== clickedEntity.value))
    }
  }

  entityCardOnEditHandler (clickedEntity: Item) {
    this.isEntityPropertiesShown = true
    this.selectedEntityId = clickedEntity.value
    this.fields.forEach((field: Field) => {
      this.updateField(this.fields, clickedEntity, field.id, field.path)
    })
  }

  entityCardOnMouseHoverHandler (cardValue: number) {
    this.entityCardHover = cardValue
  }

  chipOnClickHandler (color: string) {
    this.$data.chipColour = color
  }

  onDragStartHandler (entity: Item, e: DragEvent) {
    if (e.dataTransfer) {
      entity.image = (this.shipIcons[entity.type]) ? this.shipIcons[entity.type] : entity.image
      const image = new Image()
      if (entity.image) {
        image.src = entity.image
        e.dataTransfer.setData('entity', JSON.stringify(entity))
        e.dataTransfer.setDragImage(image, 0, 0)
      }
    }
  }
}
</script>
<style lang="scss">
.custom-add-card {
  display: flex;
  i {
    align-items: center;
    width: 100%;
  }
}

.custom-chip-group {
  margin: 0 0.5rem;
}

.custom-chip-active-class i:first-child {
  color: $room-primary !important;
  font-size: 16px !important;
}

.custom-list-item-avatar {
  background-color: $room-primary;
  >img {
    padding: 2px;
  }
}

.custom-entity-card-container {
  height: 350px;
  overflow-y: auto;
  overflow-x: hidden;
  justify-content: flex-start;
  align-content: flex-start;
}

.custom-entity-card-row {
  margin-left: 4px;
  margin-right: 4px;
}

.custom-entity-card {
  min-width: 90px;
  min-height: 90px;
  display: flex;
  align-items: center;
}

.custom-entity-card-image {
  background-color: $room-primary;
  border-radius: 50%;
  filter: opacity(0.75);
}

.custom-entity-card-list-item {
  justify-content: center;
}

.custom-menu-content-class {
  border-radius: 0;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12)
}

.custom-text-field.custom-text-field {
  input{
    text-align: right;
  }
}
</style>
