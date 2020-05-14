<template>
  <p>You're being redirected...</p>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import Vue from 'vue'
import uuid from 'uuid'

  @Component({ name: 'Index' })
export default class extends Vue {
  created () {
    this.$router.push('/' + uuid.v4().toString())
  }
}
</script>
<style scoped lang="scss"/>
