<template>
  <v-tooltip
    v-if="!isMobile"
    bottom
    nudge-bottom="10"
    :open-delay="500"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        :disabled="!isCanvasLoaded"
        color="primary"
        elevation="0"
        small
        v-on="on"
        @click="roomSaveOnClickHandler"
      >
        <v-icon size="20">fa-save</v-icon>
      </v-btn>
    </template>
    <span>{{ $t('navigation.navigation.saveRoom') }}</span>
  </v-tooltip>
  <v-list v-else dense style="width: 100%;">
    <v-list-item @click="roomSaveOnClickHandler">
      <v-list-item-title>{{ $t('navigation.navigation.saveRoom') }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import { RoomGetters } from '../../../store/modules/room'

@Component({
  name: 'TheRoomSave'
})
export default class TheRoomSave extends Vue {
  @Prop() readonly isMobile!: boolean
  @Getter(`room/${RoomGetters.IS_CANVAS_LOADED}`) isCanvasLoaded!: boolean
  isEnabled = false
  roomSaveOnClickHandler () {
    // Do something
  }
}
</script>
<style scoped lang="scss">
.theme--light.v-btn.v-btn--disabled:not(.v-btn--flat):not(.v-btn--text):not(.v-btn--outlined) {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
