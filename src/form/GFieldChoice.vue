<template>
	<v-flex xs12>
		<div v-if="choiceExist">
			<v-flex xs12>
				<g-field :field="choiceField" :model="choiceModel" @remove-field="removeChoice" :in-array="true"
				:root-model="rootModel" :path="choicePath">
					<template slot="action">
						<v-btn small depressed class="remove-btn" @click="removeChoice()">
							<v-icon>delete</v-icon>
						</v-btn>
					</template>
					<template slot="btn-append">
						<v-btn v-if="!inArray" depressed small color="gray" @click="removeChoice()">
							<v-icon>delete_outline</v-icon>
						</v-btn>
					</template>
				</g-field>
			</v-flex>
		</div>
		<v-menu offset-y v-if="!choiceExist" z-index="1000">
			<v-btn slot="activator" color="blue lighten-2" outline small>
				{{choiceBtnPrepend}} {{getLabel(field)}}
				<v-icon>arrow_drop_down</v-icon>
			</v-btn>
			<v-list>
				<v-list-tile v-for="(choice, index) in _fields" :key="index" @click="selectChoice(choice)">
					<v-list-tile-title>{{ getChoiceName(choice) }}</v-list-tile-title>
				</v-list-tile>
			</v-list>
		</v-menu>
	</v-flex>
</template>

<script>
  import { _fieldsFactory, _modelFactory, flexFactory, genPath, getChoiceName, getLabel, labelFactory } from './FormFactory';
  import _ from 'lodash';

  export default {
    name: 'GFieldChoice',
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
      choiceExist() {
        if (this.field.choiceKeyOutside) return !!this.model[this.choiceKey];
        if (!this.model[this.field.key]) return false;
        return !!this.model[this.field.key][this.choiceKey];
      },
      choiceModel() {
        if (this.field.choiceKeyOutside) return this.model;
        if (!this.model[this.field.key]) this.$set(this.model, this.field.key, {});
        return this.model[this.field.key];
      },
			choicePath() {
        if (this.field.choiceKeyOutside) return this.path;
        return this.genPath(this.field.key)
			},
      choiceBtnPrepend() {
        if (this.field.choiceKeyOutside) return 'Choose';
        return 'Add'
      },
      choiceKey() {
        return this.field.choiceKey || 'choice';
      },
      choiceField() {
        let field = _.cloneDeep(this._fields.find(choice => this.getChoiceName(choice) === this.choiceModel[this.choiceKey]));
        /*if (!['array', 'object', 'tableArray', 'input', 'input@number', 'input@multiSelect'].includes(field.type)) {
          field = {
            label: this.choiceModel[this.choiceKey],
            type: 'object', fields: [_.assign(field, {key: this.field.key})]
          }
        } else */
        if (field.type === 'object') {
          field.label = field.label || field.key;
          delete field.key;
        } else {
          field.key = this.field.key;
        }

        return field;
      }
    },
    methods: {
      genPath,
      getLabel,
      removeChoice() {
        if (this.inArray) {
          this.$emit('remove-field');
        } else {
          if (this.field.choiceKeyOutside) {
            const fields = this.choiceField.fields;
            fields && fields.map(v => v.key).forEach(k => {
              delete this.model[k];
            })
            if (this.model[this.field.key]) this.$set(this.model, this.field.key, null);
            this.$set(this.model, this.choiceKey, null);
          } else {
            this.$set(this.model, this.field.key, null);
          }
        }
      },
      selectChoice(choice) {
        this.$set(this.choiceModel, this.choiceKey, this.getChoiceName(choice));
      },
      getChoiceName,
    }
  }
</script>

<style scoped>

</style>
