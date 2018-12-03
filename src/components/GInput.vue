<template>
	<fragment>
		<v-flex :class="field.flex" class="px-2" v-if="inputType === 'switch'">
			<v-switch v-if="inputType === 'switch'" color="success" :label="label" v-model="model[field.key]"/>
		</v-flex>
		<v-flex :class="field.flex" class="px-2" v-else-if="inputType === 'select'">
			<v-select v-model="model[field.key]" :items="options" :label="label" clearable return-object attach></v-select>
		</v-flex>
		<input v-else-if="field.tableCell" :type="inputType" v-model="model[field.key]" class="form-control">
		<v-flex :class="field.flex" class="px-2" v-else>
			<v-text-field v-model="model[field.key]" :label="label" :type="inputType">
				<v-icon slot="append" v-if="field.arrayItem" @click="$emit('remove-field')">clear</v-icon>
			</v-text-field>
		</v-flex>
	</fragment>
</template>
<script>
   //not required but this baseField has a lot of useful stuff already in it, check it out
   import {Fragment} from "vue-fragment";
   import {upperFirst, get} from "lodash";
   import {VFlex, VSwitch, VSelect, VTextField, VIcon} from 'vuetify/lib';

   const _ = {upperFirst, get};

   export default {
      components: {Fragment, VFlex, VSwitch, VSelect, VTextField, VIcon},
      name: 'GInput',
      props: ['model', 'field'],
      computed: {
         inputType() {
            return _.get(this.field, 'inputType', 'text')
         },
         label() {
            if (this.field.label) return this.field.label;
            return _.upperFirst(this.field.key);
         },
         options() {
						if (typeof this.field.options === 'function') {
						   return this.field.options();
						}
						return this.field.options;
         }
      }
   }
</script>

<style lang="scss">
	@import "~bootstrap/scss/functions";
	@import "~bootstrap/scss/variables";
	@import "~bootstrap/scss/mixins";
	@import "~bootstrap/scss/forms";
</style>
