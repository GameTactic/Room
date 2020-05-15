<template>
  <span>
    <v-menu
      transition="slide-y-reverse-transition"
      :close-on-content-click="false"
      :close-on-click="false"
      offset-y
      content-class="elevation-2 custom-tactic-menu-container"
      nudge-right="0"
      top
      ref="tactic"
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip
          right
          nudge-right="10"
          :open-delay="500"
        >
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              :class="['custom-tactic-selector-menu']"
              color="primary"
              ripple
              tile
              icon
              width="48"
              large
              v-on="{ ...menu, ...tooltip }"
              elevation="0"
            >
              <v-icon dense>fa-layer-group</v-icon>
            </v-btn>
          </template>
          <span>{{ $t(`tactic.button.tooltip`) }}</span>
        </v-tooltip>
      </template>
      <v-card tile style="height: 300px;">
        <v-sheet class="pa-1 primary d-flex" tile>
          <div style="width: 2.5rem;"></div>
          <v-text-field
            v-model="search"
            :label="$t('tactic.textField.label')"
            class="body-2"
            dark
            dense
            text
            tile
            solo-inverted
            hide-details
            clearable
          ></v-text-field>
          <v-btn icon color="white" class="ml-2" @click="newTacticOnClickHandler">
            <v-icon small>fa-plus</v-icon>
          </v-btn>
        </v-sheet>
        <div v-if="tactics.length" class="custom-treeview-container">
          <v-treeview
            :items="tactics"
            item-text="name"
            item-key="id"
            :search="search"
            :open.sync="open"
            hoverable
            activatable
            open-on-click
          >
            <template v-slot:prepend="{ item: tactic }">
              <v-icon v-if="tactic.children" small v-text="'fa-folder'" />
              <v-icon v-else id="tactic-button" small v-text="'fa-map'" />
            </template>
            <template v-slot:label="{ item: tactic }">
              <span class="d-flex justify-space-between align-center">
                <span class="d-flex flex-column ">
                  <span class="body-2" v-text="tactic.name" />
                  <span class="caption" v-text="tactic.map.name" />
                </span>
                <v-btn
                  elevation="0"
                  tile
                  class="pr-2"
                  color="white"
                  height="30"
                  x-small
                  ripple
                >
                  <v-badge
                    right
                    overlap
                    color="primary"
                    :content="numberUsersOnTactic(tactic)"
                  >
                    <v-icon color="grey darken-1">fa-user-circle</v-icon>
                  </v-badge>
                </v-btn>
              </span>
            </template>
            <template v-slot:append="{ item: tactic }">
              <v-menu
                offset-y
                nudge-left="100"
                nudge-width="80"
                content-class="elevation-2"
              >
                <template v-slot:activator="{ on: menuItem }">
                  <v-btn
                    elevation="0"
                    tile
                    color="white"
                    height="30"
                    x-small
                    ripple
                    v-on="menuItem"
                  >
                    <v-icon small color="grey darken-1">fa-ellipsis-v</v-icon>
                  </v-btn>
                </template>
                <v-card tile>
                  <v-list dense>
                    <v-list-item
                      v-for="(item, index) in cardMenuItems"
                      :key="index"
                      @click="tacticMenuOnClickHandler(item, tactic)"
                    >
                      <v-list-item-icon class="custom-autocomplete-tactic-menu-icon">
                        <v-icon
                          small
                          :color="tacticMenuColour(tactic, item)"
                          v-text="tacticMenuIcon(tactic, item)" />
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title v-text="tacticMenuPinText(tactic, item)" />
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </template>
          </v-treeview>
        </div>
        <v-sheet
          v-else
        >
          <v-subheader>{{ $t('tactic.noTacticsFound') }}</v-subheader>
        </v-sheet>
      </v-card>
    </v-menu>

    <v-tabs
      :class="['custom-tactic-tabs', pinnedTactics.length ? 'custom-tactic-pinned-tabs' : '']"
      next-icon="fa-arrow-right"
      prev-icon="fa-arrow-left"
      show-arrows
      height="42"
      icons-and-text
    >
      <v-tabs-slider color="primary"></v-tabs-slider>
      <v-menu
        v-for="pinnedTactic in pinnedTactics"
        :key="pinnedTactic.id"
        open-on-hover
        content-class="elevation-1"
        top
        offset-y
        z-index="100"
      >
        <template v-slot:activator="{ on: pinnedTab }">
          <v-tab
            :href="'#tab-' + pinnedTactic.id"
            v-on="pinnedTab"
          >
            <div class="caption" v-text="pinnedTactic.name" />
          </v-tab>
        </template>
        <v-card tile flat>
          <div class="d-flex flex-column align-center">
            <v-img
              :src="pinnedTactic.map.icon"
              width="80"
              eager
              :alt="'Image of ' + pinnedTactic.map.name"
              class="custom-pinned-tactic-popup"
            />
            <div class="caption" v-text="pinnedTactic.name" />
            <div class="caption" v-text="pinnedTactic.map.name" />
          </div>
        </v-card>
      </v-menu>
    </v-tabs>
  </span>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'
import { TacticGetters, TacticAction } from '@/store/modules/tactic'
import { Tactic } from '@/store/modules/types'
import { EventBus } from '../../event-bus'

interface TacticMenuItem {
  action: string;
  title: string;
  titleTwo?: string;
  icon: string;
}

@Component({
  name: 'TheTacticSelector'
})
export default class TheTacticSelector extends Vue {
  @Prop() private id!: string
  @Prop() private icon!: string
  @Getter(`tactic/${TacticGetters.TACTICS}`) tactics!: Tactic[]
  @Getter(`tactic/${TacticGetters.PINNED_TACTICS}`) pinnedTactics!: Tactic[]
  @Action(`tactic/${TacticAction.DELETE_TACTIC}`) deleteTactic!: (id: string) => void
  @Action(`tactic/${TacticAction.UPDATE_TACTIC}`) updateTactic!: (tactic: Tactic) => void
  @Action(`tactic/${TacticAction.TOGGLE_PIN_TACTIC}`) togglePinTactic!: (tactic: Tactic) => void

  open = []
  search = null
  isEditTacticDialogVisible = false
  cardMenuItems: TacticMenuItem[] = [{
    action: 'edit',
    title: `Edit Tactic`,
    icon: 'fa-edit'
  }, {
    action: 'pin',
    title: `Pin Tactic`,
    titleTwo: `Unpin Tactic`,
    icon: 'fa-bookmark'
  }, {
    action: 'delete',
    title: `Delete Tactic`,
    icon: 'fa-times'
  }]

  tacticMenuColour (tactic: Tactic, item: TacticMenuItem) {
    if (item.action === 'pin' && tactic.pinned) {
      return 'primary'
    } else if (item.action === 'delete') {
      return 'error'
    }
    return ''
  }

  tacticMenuIcon (tactic: Tactic, item: TacticMenuItem) {
    return item.icon
  }

  tacticMenuPinText (tactic: Tactic, item: TacticMenuItem) {
    if (item.action === 'pin' && tactic.pinned && item.titleTwo) {
      return item.titleTwo
    }
    return item.title
  }

  newTacticOnClickHandler () {
    EventBus.$emit('openCreateNewTacticOverlay')
  }

  tacticMenuOnClickHandler (menuItem: TacticMenuItem, tactic: Tactic) {
    switch (menuItem.action) {
      case 'edit':
        EventBus.$emit('openManageTacticsOverlay', tactic)
        break
      case 'delete':
        this.deleteTactic(tactic.id)
        break
      case 'pin':
        this.togglePinTactic(tactic)
        break
      default:
        break
    }
  }

  // To be implemented correctly when user management has been added
  numberUsersOnTactic () {
    return 1
  }
}

</script>
<style scoped lang="scss">
.custom-tactic-selector-menu {
  position: fixed;
  bottom: 0px;
  left: 2px;
  background-color: white;
  border: 2px solid rgba(0, 0, 0, 0.12);
}

.custom-tactic-menu-container {
  left: 2px !important;
}

.custom-autocomplete-tactic-menu-icon {
  margin-right: 6px !important;
}

.custom-tactic-tabs {
  position: fixed;
  bottom: 0;
  left: 50%;
  width: auto;
  max-width: 80%;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.custom-treeview-container {
  max-height: 250px;
  overflow-y: auto;
}

.custom-pinned-tactic-popup {
  border-radius: 50%;
  margin-top: 0.5rem;
}

</style>
<style lang="scss">
@mixin pinnedTabSlants {
  content: "";
  position: absolute;
  height: 100%;
  -webkit-transform-origin: 100% 0;
  transform-origin: 100% 0;
  z-index: -1;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background: white;
  width: 60px;
}

.custom-tactic-pinned-tabs > div {
  position: relative;
  left: -50%;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  &::after {
    @include pinnedTabSlants;
    right: 0px;
    -webkit-transform: skew(45deg);
    transform: skew(45deg);
    border-right: 1.5px solid rgba(0, 0, 0, 0.05);
  }
  &::before {
    @include pinnedTabSlants;
    left: 0px;
    -webkit-transform: skew(-45deg);
    transform: skew(-45deg);
    border-left: 1.5px solid rgba(0, 0, 0, 0.05);
  }
}
</style>
