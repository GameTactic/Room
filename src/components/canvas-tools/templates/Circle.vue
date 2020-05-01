<template>
  <v-card>
    <v-card-subtitle class="pb-0 pl-5 custom-hide-text">
      {{ $t('tool.template.fill') }}
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <colour-picker :swatchProp.sync="transparentSwatches" :value.sync="circleColour" />
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5 custom-hide-text">
      {{ $t('tool.template.size') }}
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <size-picker class="px-2" :value.sync="circleSize"></size-picker>
    </v-card-actions>
    <v-card-subtitle class="pb-0 pl-5 pt-2 custom-hide-text">
      {{ $t('tool.template.colour') }}
    </v-card-subtitle>
    <v-card-actions class="py-0">
      <colour-picker :value.sync="circleOutlineColour" />
    </v-card-actions>
    <v-card-subtitle class="py-0 pl-5 custom-hide-text">
      {{ $t('tool.template.strokeStyle') }}
    </v-card-subtitle>
    <v-card-actions class="pb-0">
      <v-radio-group v-model="circleStrokeStyle" row class="mt-1 px-3 flex-fill">
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
          v-model="circleTemporary"
          class="mt-0"
          :label="circleTemporary ? $t('tool.template.permanent') : $t('tool.template.temporary')"
        ></v-switch>
        <v-spacer></v-spacer>
        <v-switch
          v-model="circleShowRadius"
          class="mt-0"
          :label="circleShowRadius ?$t('tool.template.showRadius') : $t('tool.template.hideRadius')"
        ></v-switch>
        <v-spacer></v-spacer>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { ToolInterface } from '@/tools/Tool'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'
import { ToolGetters, ToolsAction } from '@/store/modules/tools'
import ColourPicker from '@/components/canvas-tools/templates/template-tools/ColourPicker.vue'
import SizePicker from '@/components/canvas-tools/templates/template-tools/SizePicker.vue'

const Tools = namespace(Namespaces.TOOLS)

@Component({
  name: 'DrawCircle',
  components: { SizePicker, ColourPicker }
})
export default class PopoutButton extends Vue {
  @Tools.Getter(ToolGetters.TOOL) findTool!: (name: string) => ToolInterface
  @Tools.Action(ToolsAction.SET_SIZE) setSize!: (size: number) => void
  @Tools.Action(ToolsAction.SET_COLOUR) setColour!: (colour: string) => void
  @Tools.Action(ToolsAction.SET_SHOW_RADIUS) setShowRadius!: (showRadius: boolean) => void
  @Tools.Action(ToolsAction.SET_OUTLINE_COLOUR) setOutlineColour!: (outlineColour: string) => void
  @Tools.Action(ToolsAction.SET_TEMPORARY) setTemporary!: (temporary: boolean) => void
  @Tools.Action(ToolsAction.SET_STROKE_STYLE) setStrokeStyle!: (strokeStyle: number) => void

  transparentSwatches = [
    ['#CE000080', '#40476D80'],
    ['#D74E0980', '#79238780'],
    ['#F2BB0580', '#3349F480'],
    ['#08A04580', '#4392F180'],
    ['#F7FFF780', '#66666680']
  ]

  get circleSize () {
    return this.findTool('circle').size || 5
  }

  set circleSize (newValue: number) {
    this.setSize(newValue)
  }

  get circleColour (): string {
    return this.findTool('circle').colour || '#CE0000FF'
  }

  set circleColour (newValue: string) {
    this.setColour(newValue)
  }

  get circleOutlineColour (): string {
    return this.findTool('circle').outlineColour || '#CE0000FF'
  }

  set circleOutlineColour (newValue: string) {
    this.setOutlineColour(newValue)
  }

  get circleShowRadius (): boolean {
    return this.findTool('circle').showRadius || false
  }

  set circleShowRadius (newValue: boolean) {
    this.setShowRadius(newValue)
  }

  get circleTemporary (): boolean {
    return !this.findTool('circle').temporary || false
  }

  set circleTemporary (newValue: boolean) {
    this.setTemporary(!newValue)
  }

  get circleStrokeStyle (): number {
    return this.findTool('circle').strokeStyle || 0
  }

  set circleStrokeStyle (newValue: number) {
    this.setStrokeStyle(newValue)
  }
}

</script>
<style scoped lang="scss">

</style>
