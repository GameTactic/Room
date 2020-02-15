<template>
  <div class="full-width-height">
    <the-canvas :id="id"/>
    <the-nav-extra-large class="the-nav-extra-large" :id="id"/>
    <the-nav-small class="the-nav-small" :id="id"/>
    <the-nav-extra-small class="the-nav-extra-small" :id="id"/>
    <the-tool-panel :id="id"/>
    <the-entity-panel :id="id"/>
  </div>
</template>

<script lang="ts">
import TheNavExtraLarge from '@/components/navigation/TheNavExtraLarge.vue'
import TheNavSmall from '@/components/navigation/TheNavSmall.vue'
import TheNavExtraSmall from '@/components/navigation/TheNavExtraSmall.vue'
import TheToolPanel from '@/components/TheToolPanel.vue'
import TheCanvas from '@/components/TheCanvas.vue'
import TheEntityPanel from '@/components/TheEntityPanel.vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import Vue from 'vue'
import { namespace } from 'vuex-class'
import { Namespaces } from '@/store'

const Socket = namespace(Namespaces.SOCKET)

  @Component({
    name: 'Room',
    components: {
      TheNavExtraLarge,
      TheNavSmall,
      TheNavExtraSmall,
      TheToolPanel,
      TheCanvas,
      TheEntityPanel
    }
  })
export default class extends Vue {
    @Prop() id!: string
    @Socket.Getter('socket') socket!: WebSocket

    created () {
      this.socket.onopen = () => {
        // eslint-disable-next-line @typescript-eslint/camelcase
        this.socket.send(JSON.stringify({ join_room: this.id }))
      }
    }
}
</script>
<style scoped lang="scss">
  .full-width-height {
    width: 100%;
    height: 100%;
  }

  @media (max-width: 575px) {
    .the-nav-extra-large, .the-nav-small {
      display: none;
    }
  }

  @media (min-width: 576px) and (max-width: 1199px) {
    .the-nav-extra-large, .the-nav-extra-small {
      display: none;
    }
  }

  @media (min-width: 1200px) {
    .the-nav-small, .the-nav-extra-small {
      display: none;
    }
  }
</style>
