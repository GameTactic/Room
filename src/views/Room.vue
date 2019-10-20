<template>
  <div>
    <Nav :id="id"/>
    <v-content>
      <Map-buttons :id="id" />
    </v-content>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'
import MapButtons from '@/components/MapButtons.vue'
export default {
  name: 'room',
  props: {
    id: String
  },
  components: {
    Nav,
    MapButtons
  }
}
</script>
