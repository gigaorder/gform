<!--<template>
	<v-layout row wrap>
		<v-flex>
			<slot name="name"></slot>
		</v-flex>
		<v-flex>
			<slot name="nr"></slot>
		</v-flex>
	</v-layout>
</template>-->

<script>
  export default {
    name: 'TestLayout',
    props: {},
    data: function () {
      return {}
    },
		render(h) {
      const children = this.$slots.default;
      return <div>{children}</div>;
		},
    computed: {},
    methods: {}
  }
</script>

<style scoped>

</style>
