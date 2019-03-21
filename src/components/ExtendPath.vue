<template>
  <fragment>
    <slot></slot>
  </fragment>
</template>

<script>
  import { Fragment } from 'vue-fragment';
  // use to add suffix to path
  export default {
    name: "ExtendPath",
    components: { Fragment },
    props: ['extend'],
    inject: {
      path: { default: null }
    },
    provide() {
      return {
        path: `${this.path}.${this.extend}`
      }
    }
  }
</script>

<style scoped>

</style>
