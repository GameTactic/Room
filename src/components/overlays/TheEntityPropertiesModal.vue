<template>
  <v-dialog
    v-model="overlay"
    width="400"
  >
    <v-card class="pa-12">
      <v-text-field
          v-if="!field.hide"
          outlined
          dense
          @change="onTextFieldChangeHandler(entities, selectedEntityId, field, $event)"
        />
      <!-- <div
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
      </div> -->
    </v-card>
  </v-dialog>
</template>
<script lang="ts">
import Vue from 'vue'
import Component, { mixins } from 'vue-class-component'
import { EventBus } from '@/event-bus'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { Ship } from '@/types/games/wows'

// const SocketRoom = namespace(Namespaces.SOCKET_ROOM)

@Component({
  name: 'TheEntityPropertiesModal'
})
export default class TheEntityPropertiesModal extends Vue {
  overlay = false
  selectedEntity: Ship | {} = {}

  created () {
    EventBus.$on('openTheEntityPropertiesModal', (entity: Ship) => {
      this.overlay = true
      this.selectedEntity = { ...entity }
    })
  }
}
</script>
<style lang="scss" scoped>

</style>
