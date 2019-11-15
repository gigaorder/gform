<template>
	<fragment>
		<v-flex :class="[flex]" v-for="(val, index) in model[field.key]" :key="index">
			<g-field-choice @remove-field="model[field.key].splice(index, 1)" :in-array="true"
											:rootModel="rootModel" :path="genPath(field.key)"
											:field="createChoiceArrayField(index)" :model="model[field.key]"></g-field-choice>
		</v-flex>
		<v-flex class="md12">
			<v-menu offset-y v-if="!inArray" z-index="1000">
				<v-btn slot="activator" color="primary" small>
					Add {{getLabel(field)}}
					<v-icon>arrow_drop_down</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile v-for="(choice, index) in _fields" :key="index" @click="selectChoiceInArray(choice)">
						<v-list-tile-title>{{ getChoiceName(choice) }}</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>
		</v-flex>
	</fragment>
</template>

<script>
  import { _fieldsFactory, _modelFactory, flexFactory, genPath, getChoiceName, getLabel, labelFactory } from './FormFactory';
  import _ from 'lodash';

  export default {
    name: 'GFieldChoiceArray',
    props: ['model', 'field', 'inArray', 'rootModel', 'path'],
    data: function () {
      return {}
    },
    setup(props, context) {
      const _model = _modelFactory(props);
      const flex = flexFactory(props)
      const label = labelFactory(props);
      const _fields = _fieldsFactory(props);

      return { _model, flex, label, _fields }
    },
    computed: {
      choiceKey() {
        return this.field.choiceKey || 'choice';
      },
    },
    methods: {
      genPath,
      getLabel,
      getChoiceName,
      createArrayField(fields, $index) {
        return _.assign(_.cloneDeep(fields[0]), { key: $index, flex: this.field.flex, label: this.label });
      },
      addItem() {
        if (!this.model[this.field.key]) this.$set(this.model, this.field.key, []);
        this.model[this.field.key].push(null);
      },
      createChoiceArrayField(index) {
        return {
          key: index,
          type: 'choice',
          choiceKey: this.field.choiceKey,
          label: this.field.label,
          fields: this.field.fields,
          dynamicFields: this.field.dynamicFields
        };
      },
      selectChoiceInArray(choice) {
        if (!this.model[this.field.key]) this.$set(this.model, this.field.key, []);
        this.model[this.field.key].push({ [this.choiceKey]: this.getChoiceName(choice) });
      },
    }
  }
</script>

<style scoped>

</style>
