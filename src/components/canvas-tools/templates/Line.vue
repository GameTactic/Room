<template>
  <v-card>
    <v-card-subtitle class="pb-0 pl-5 custom-hide-text">
      {{ $t('tool.template.colour') }}
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <colour-picker :value.sync="lineColour" />
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5 custom-hide-text">
      {{ $t('tool.template.size') }}
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <size-picker class="px-2" :value.sync="lineSize"></size-picker>
    </v-card-actions>
    <v-card-subtitle class="pb-0 pl-5 pt-2 custom-hide-text">
      {{ $t('tool.template.endStyle') }}
    </v-card-subtitle>
    <v-card-actions class="pb-0">
      <v-radio-group v-model="lineEndStyle" row class="mt-1 px-3 flex-fill">
        <v-spacer></v-spacer>
        <v-tooltip top :open-delay="500">
          <template v-slot:activator="{ on }">
            <v-radio v-on="on" class="mr-0" name="endStyle" on-icon="fa-arrow-right" off-icon="fa-arrow-right" :value="LineType.ARROW"></v-radio>
          </template>
          <span>{{ $t('tool.template.arrow') }}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip top :open-delay="500">
          <template v-slot:activator="{ on }">
            <v-radio v-on="on" class="mr-0" name="endStyle" on-icon="$vuetify.icons.normalLineActive" off-icon="$vuetify.icons.normalLine" :value="LineType.LINE"></v-radio>
          </template>
          <span>{{ $t('tool.template.solidLine') }}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip top :open-delay="500">
          <template v-slot:activator="{ on }">
            <v-radio v-on="on" class="mr-0" name="endStyle" on-icon="$vuetify.icons.tBarHeadActive" off-icon="$vuetify.icons.tBarHead" :value="LineType.T_BAR"></v-radio>
          </template>
          <span>{{ $t('tool.template.tBar') }}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
      </v-radio-group>
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5 custom-hide-text">
      {{ $t('tool.template.strokeStyle') }}
    </v-card-subtitle>
    <v-card-actions class="pb-0">
      <v-radio-group v-model="lineStrokeStyle" row class="mt-1 px-3 flex-fill">
        <v-spacer></v-spacer>
        <v-tooltip top :open-delay="500">
          <template v-slot:activator="{ on }">
            <v-radio v-on="on" class="mr-0" name="strokeStyle" on-icon="$vuetify.icons.normalLineActive" off-icon="$vuetify.icons.normalLine" :value="0"></v-radio>
          </template>
          <span>{{ $t('tool.template.solidLine') }}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip top :open-delay="500">
          <template v-slot:activator="{ on }">
            <v-radio v-on="on" class="mr-0" name="strokeStyle" on-icon="$vuetify.icons.dashedLineActive" off-icon="$vuetify.icons.dashedLine" :value="1"></v-radio>
          </template>
          <span>{{ $t('tool.template.dashedLine') }}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
      </v-radio-group>
    </v-card-actions>
    <v-card-actions class="py-0 px-2">
      <v-row>
        <v-spacer></v-spacer>
        <v-switch
          v-model="lineTemporary"
          class="mt-0"
          :label="lineTemporary ? $t('tool.template.permanent') : $t('tool.template.temporary')"
        ></v-switch>
        <v-spacer></v-spacer>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Tool } from '@/tools/Tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { AppToolGetters, AppToolsAction } from '@/store/modules/app/tools'
import ColourPicker from '@/components/canvas-tools/templates/template-tools/ColourPicker.vue'
import SizePicker from '@/components/canvas-tools/templates/template-tools/SizePicker.vue'
import { LineType } from '@/tools/Line'

const AppTools = namespace(Namespaces.APP_TOOLS)

@Component({
  name: 'StraightLine',
  components: { SizePicker, ColourPicker }
})
export default class PopoutButton extends Vue {
  @AppTools.Getter(AppToolGetters.TOOL) findTool!: (name: string) => Tool
  @AppTools.Action(AppToolsAction.SET_COLOUR) setColour!: (colour: string) => void
  @AppTools.Action(AppToolsAction.SET_SIZE) setSize!: (size: number) => void
  @AppTools.Action(AppToolsAction.SET_END_STYLE) setEndStyle!: (endStyle: string) => void
  @AppTools.Action(AppToolsAction.SET_STROKE_STYLE) setStrokeStyle!: (strokeStyle: number) => void
  @AppTools.Action(AppToolsAction.SET_TEMPORARY) setTemporary!: (temporary: boolean) => void
  LineType = LineType

  get lineSize () {
    return this.findTool('line').size || 5
  }

  set lineSize (newValue: number) {
    this.setSize(newValue)
  }

  set lineColour (newValue: string) {
    this.setColour(newValue)
  }

  get lineColour (): string {
    return this.findTool('line').colour || '#CE0000FF'
  }

  get lineEndStyle (): string {
    return this.findTool('line').endStyle || LineType.LINE
  }

  set lineEndStyle (newValue: string) {
    this.setEndStyle(newValue)
  }

  get lineStrokeStyle (): number {
    return this.findTool('line').strokeStyle || 0
  }

  set lineStrokeStyle (newValue: number) {
    this.setStrokeStyle(newValue)
  }

  get lineTemporary (): boolean {
    return !this.findTool('line').temporary || false
  }

  set lineTemporary (newValue: boolean) {
    this.setTemporary(!newValue)
  }
}

</script>
<style scoped lang="scss">

</style>
<style lang="scss">
.v-color-picker__controls {
  display: none;
}
</style>
