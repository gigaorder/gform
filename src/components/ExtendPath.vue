<template>
  <fragment>
    <slot></slot>
  </fragment>
</template>

<script>
  import { Fragment } from 'vue-fragment';

  export default {
    name: "ExtendPath",
    components: { Fragment },
    props: ['extend'],
    inject: {
      path: { default: null }
    },
    provide() {
      return {
        path: {
          [Symbol.toPrimitive]: () => {
            return `${this.path}.${this.extend}`;
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
