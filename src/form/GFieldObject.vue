<template>
	<v-flex xs12 v-if="!noPanel">
		<fieldset v-show="_fields && _fields.length > 0" style="position: relative">
			<slot name="action">
				<v-btn small depressed class="remove-btn" @click="model[field.key] = undefined">
					<v-icon>delete</v-icon>
				</v-btn>
			</slot>
			<legend v-if="label">
				<span @click="collapse = !collapse">{{label}} {{collapse ? '+' : ''}}</span>
			</legend>

			<VExpandTransition>
				<v-layout row wrap style="padding-top: 5px;" v-show="!collapse">
					<g-field :fields="_fields" :model="_model" :rootModel="rootModel" :path="objectPath"/>
				</v-layout>
			</VExpandTransition>
		</fieldset>
	</v-flex>

	<v-flex xs12 v-else-if="noPanel" style="position: relative">
		<slot name="action"/>
		<g-field :fields="_fields" :model="_model" :rootModel="rootModel" :path="objectPath"/>
	</v-flex>
</template>

<script>
  import { _fieldsFactory, _modelFactory, addObjectItem, flexFactory, genPath, getLabel, labelFactory } from './FormFactory';
  import _ from 'lodash';

  export default {
    name: 'GFieldObject',
    props: ['model', 'field', 'rootModel', 'path'],
    data: () => ({
      collapse: false
    }),
    setup(props, context) {
      const _model = _modelFactory(props);
      const flex = flexFactory(props)
      const label = labelFactory(props);
      const _fields = _fieldsFactory(props);

      return { _model, flex, label, _fields }
    },
    computed: {
      noPanel() {
        return this.field.noPanel;
      },
			objectPath() {
        return genPath.bind(this)(this.field.key);
			}
    },
    methods: {
      getLabel,
    }
  }
</script>

<style lang="scss" scoped>
	fieldset {
		padding: 0 10px 10px 10px;
		position: relative;
		top: 0;
		border: 1px solid #eee;
		border-radius: 2px;
		//background-color: rgba(128, 128, 128, 0.03);
		width: 100%;
		margin-bottom: 20px;
	}

	legend {
		color: #337ab7;
		border: 0;
		margin-left: 10px;
		width: initial;
		padding: 1px 5px;
		font-size: 1.3em;
		font-weight: 300;
		font-family: Roboto, sans-serif;
	}

	.add-btn {
		margin-left: 0;
		box-shadow: 0 1px 1px 0 #9c9c9c;
	}

	.remove-btn {
		position: absolute;
		right: 0;
		top: 14px;
		margin: 0;
		font-size: 1.3em;
		padding: 0px;
		min-width: 32px;
		width: 32px;
		border: 1px solid #eaeaea;
		background-color: #f9f9f9 !important;
		z-index: 10;
		height: 23px;

		::v-deep .v-icon {
			font-size: 0.9em;
			color: #6d6d6d;
		}
	}

	.fix-inline {
		padding-right: 7px;
		padding-left: 7px;

		.remove-btn {
			right: 0px;
		}
	}
</style>
