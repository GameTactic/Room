<template>
  <div class="full-width-height">
    <map-canvas :id="id" />
    <Nav-small class="nav-small" :id="id"/>
    <Nav-large class="nav-large" :id="id"/>
    <map-buttons :id="id" />
    <map-entity-panel :id="id" />
  </div>
</template>

<script>
import NavLarge from '@/components/NavLarge.vue'
import NavSmall from '@/components/NavSmall.vue'
import MapButtons from '@/components/MapButtons.vue'
import MapCanvas from '@/components/MapCanvas.vue'
import EntityPanel from '@/components/EntityPanel.vue'
import MapEntityPanel from '@/components/MapEntityPanel.vue'
export default {
  name: 'Room',
  props: {
    id: String
  },
  components: {
    NavLarge: NavLarge,
    NavSmall: NavSmall,
    MapButtons,
    MapCanvas,
    MapEntityPanel
  }
}
</script>
<style scoped lang="scss">
.full-width-height {
  width: 100%;
  height: 100%;
}
@media (max-width: 1023px) {
  .nav-large {
    display: none;
  }
}
@media (min-width: 1024px) {
  .nav-small {
    display: none;
  }
}
</style>
