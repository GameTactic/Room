<template>
  <span>
    <v-menu
      :close-on-content-click="false"
      :close-on-click="false"
      ref="tactic"
      transition="slide-y-reverse-transition"
      content-class="elevation-2 custom-tactic-menu-container"
      nudge-right="0"
      offset-y
      top
    >
      <template v-slot:activator="{ on: menu }">
        <v-tooltip
          :open-delay="500"
          right
          nudge-right="10"
        >
          <template v-slot:activator="{ on: tooltip }">
            <v-btn
              :disabled="!(jwt && jwt.jti)"
              class="custom-tactic-selector-menu"
              color="primary"
              width="48"
              elevation="0"
              ripple
              tile
              icon
              large
              v-on="{ ...menu, ...tooltip }"
            >
              <v-icon dense>fa-layer-group</v-icon>
            </v-btn>
          </template>
          <span>{{ $t(`tactic.button.tooltip`) }}</span>
        </v-tooltip>
      </template>
      <v-card tile class="custom-tactic-card">
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
          />
          <v-btn
            :disabled="!api.length"
            icon
            color="white"
            class="ml-2 d-none d-sm-flex"
            @click="newTacticOnClickHandler"
          >
            <v-icon small>fa-plus</v-icon>
          </v-btn>
          <div class="d-flex d-sm-none" style="width: 2.5rem;"></div>
        </v-sheet>
        <div
          v-if="tactics.length"
          class="custom-treeview-container"
        >
          <v-treeview
            :items="tactics"
            :search="search"
            :open.sync="open"
            item-key="id"
            item-text="name"
            hoverable
            activatable
            open-on-click
          >
            <template v-slot:prepend="{ item: tactic }">
              <v-icon
                v-if="tactic.children"
                small
                v-text="'fa-folder'"
              />
              <v-icon
                v-else
                id="tactic-button"
                small
                v-text="'fa-map'"
              />
            </template>
            <template v-slot:label="{ item: tactic }">
              <span class="d-flex justify-space-between align-center">
                <span class="d-flex flex-column">
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
                    color="white"
                    height="30"
                    tile
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
        <v-sheet v-else>
          <v-subheader>{{ $t('tactic.noTacticsFound') }}</v-subheader>
        </v-sheet>
      </v-card>
    </v-menu>

    <v-tabs
      :class="['custom-tactic-tabs', 'd-none d-sm-flex', pinnedTactics.length ? 'custom-tactic-pinned-tabs' : '']"
      next-icon="fa-arrow-right"
      prev-icon="fa-arrow-left"
      height="42"
      show-arrows
      icons-and-text
    >
      <v-tabs-slider color="primary" />
      <v-menu
        v-for="pinnedTactic in pinnedTactics"
        :key="pinnedTactic.id"
        content-class="elevation-1"
        z-index="100"
        open-on-hover
        top
        offset-y
      >
        <template v-slot:activator="{ on: pinnedTab }">
          <v-tab :href="`#tab-'${pinnedTactic.id}`" v-on="pinnedTab">
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
import { namespace } from 'vuex-class'
import { SocketTacticGetters, SocketTacticAction } from '@/store/modules/socket/tactic'
import { Tactic, Api } from '@/store/types'
import { EventBus } from '../../event-bus'
import { AppAuthenticationGetters, ExtendedJWT } from '../../store/modules/app/authentication'
import { Namespaces } from '@/store'
import { AppRoomGetters } from '../../store/modules/app/room'

const SocketTactic = namespace(Namespaces.SOCKET_TACTIC)
const AppAuthentication = namespace(Namespaces.APP_AUTHENTICATION)
const appRoom = namespace(Namespaces.APP_ROOM)

interface TacticMenuItem {
  action: string;
  title: string;
  titleTwo?: string;
  icon: string;
}

enum TacticMenuOptions {
  EDIT = 'edit',
  PIN = 'pin',
  DELETE = 'delete',
}

@Component({
  name: 'TheTacticSelector'
})
export default class TheTacticSelector extends Vue {
  @Prop() private icon!: string
  @AppAuthentication.Getter(AppAuthenticationGetters.JWT) jwt!: ExtendedJWT
  @appRoom.Getter(AppRoomGetters.API) api!: Api[]
  @SocketTactic.Getter(SocketTacticGetters.TACTICS) tactics!: Tactic[]
  @SocketTactic.Getter(SocketTacticGetters.PINNED_TACTICS) pinnedTactics!: Tactic[]
  @SocketTactic.Action(SocketTacticAction.DELETE_TACTIC) deleteTactic!: (id: string) => void
  @SocketTactic.Action(SocketTacticAction.UPDATE_TACTIC) updateTactic!: (tactic: Tactic) => void
  @SocketTactic.Action(SocketTacticAction.TOGGLE_PIN_TACTIC) togglePinTactic!: (tactic: Tactic) => void

  open: string[] = []
  search: string | null = null
  isEditTacticDialogVisible = false
  cardMenuItems: TacticMenuItem[] = [{
    action: TacticMenuOptions.EDIT,
    title: `Edit Tactic`,
    icon: 'fa-edit'
  }, {
    action: TacticMenuOptions.PIN,
    title: `Pin Tactic`,
    titleTwo: `Unpin Tactic`,
    icon: 'fa-bookmark'
  }, {
    action: TacticMenuOptions.DELETE,
    title: `Delete Tactic`,
    icon: 'fa-times'
  }]

  tacticMenuColour (tactic: Tactic, item: TacticMenuItem) {
    if (item.action === TacticMenuOptions.PIN && tactic.pinned) {
      return 'primary'
    } else if (item.action === TacticMenuOptions.DELETE) {
      return 'error'
    }
    return ''
  }

  tacticMenuIcon (tactic: Tactic, item: TacticMenuItem) {
    return item.icon
  }

  tacticMenuPinText (tactic: Tactic, item: TacticMenuItem) {
    if (item.action === TacticMenuOptions.PIN && tactic.pinned && item.titleTwo) {
      return item.titleTwo
    }
    return item.title
  }

  newTacticOnClickHandler () {
    EventBus.$emit('openCreateNewTacticOverlay')
  }

  tacticMenuOnClickHandler (menuItem: TacticMenuItem, tactic: Tactic) {
    switch (menuItem.action) {
      case TacticMenuOptions.EDIT:
        EventBus.$emit('openManageTacticsOverlay', tactic)
        break
      case TacticMenuOptions.DELETE:
        this.deleteTactic(tactic.id)
        break
      case TacticMenuOptions.PIN:
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

.custom-tactic-card {
  height: 300px;
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
