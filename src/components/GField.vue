<template>
	<v-tabs style="width: 100%" v-if="tabs">
		<v-tab v-for="tab in getTabs()" :key="tab.name">{{tab.name}}</v-tab>
		<v-tab-item v-for="tab in getTabs()" :key="tab.name" style="padding-top: 20px;">
			<v-layout row wrap>
				<g-field v-for="(_field, index) in tab.fields" :key="index" :field="_field" :model="model"></g-field>
			</v-layout>
		</v-tab-item>
		<slot name="tab-append"></slot>
	</v-tabs>

	<v-layout row wrap v-else-if="fields">
		<g-field v-for="(_field, index) in fields" :key="index" :field="_field" :model="model"></g-field>
	</v-layout>

	<div v-else-if="!field.type"></div>

	<component v-else-if="!isArray && !isObject && !isChoice && !isChoiceArray" :is="type" :field="field" :model="model"
						 v-on="$listeners" :in-array="inArray">
		<slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>
	</component>

	<v-flex class="xs12" v-else-if="isChoiceArray">
		<v-flex class="md12" v-for="(val, index) in model[field.key]" :key="index">
			<g-field @remove-field="model[field.key].splice(index, 1)" :in-array="true"
							 :field="createChoiceArrayField(index)" :model="model[field.key]"></g-field>
		</v-flex>
		<v-flex class="md12">
			<v-menu offset-y v-if="!inArray" z-index="1000">
				<v-btn slot="activator" color="primary" small>
					Add {{getLabel(field)}}
					<v-icon>arrow_drop_down</v-icon>
				</v-btn>
				<v-list>
					<v-list-tile v-for="(choice, index) in field.fields" :key="index" @click="selectChoiceInArray(choice)">
						<v-list-tile-title>{{ getChoiceName(choice) }}</v-list-tile-title>
					</v-list-tile>
				</v-list>
			</v-menu>
		</v-flex>
	</v-flex>

	<v-flex xs12 v-else-if="isChoice">
		<div v-if="choiceExist">
			<v-flex xs12>
				<g-field :field="createChoiceField()" :model="choiceModel" @remove-field="removeChoice" :in-array="true">
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
			<v-btn slot="activator" color="primary" small>
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

	<v-flex xs12 v-else-if="isObject && !noPanel">
		<fieldset>
			<slot name="action"/>
			<legend v-if="label">
				<span>{{label}}</span>
			</legend>

			<v-layout row wrap style="padding-top: 5px;">
				<g-field :fields="_fields" :model="_model"/>
			</v-layout>
		</fieldset>
	</v-flex>

	<v-flex xs12 v-else-if="isObject && noPanel" style="position: relative">
		<slot name="action"/>
		<g-field :fields="_fields" :model="model"/>
	</v-flex>

	<v-flex class="xs12" v-else-if="isSimpleArray">
		<v-flex class="xs12" v-for="(val, index) in model[field.key]" :key="index">
			<g-field @remove-field="_model.splice(index, 1)" :in-array="true"
							 :field="createArrayField(field.fields, index)" :model="model[field.key]"></g-field>
		</v-flex>
		<v-flex class="xs12">
			<v-btn color="primary" small @click="addItem()">
				Add {{getLabel(field)}}
			</v-btn>
			<slot name="btn-append"></slot>
		</v-flex>
	</v-flex>

	<v-layout row wrap class="xs12" v-else-if="isObjectArray">
		<v-flex xs12 v-for="(val, index) in model[field.key]" :key="index" style="position: relative;">
			<v-btn small depressed class="remove-btn" @click="model[field.key].splice(index, 1)">
				<v-icon>delete</v-icon>
			</v-btn>
			<g-field :field="createObjectArrayField(field.fields, index)" :model="model[field.key]"
							 :in-array="true"></g-field>
		</v-flex>
		<v-flex class="md12">
			<v-btn color="primary" small @click="addObjectItem()">
				Add {{getLabel(field)}}
			</v-btn>
		</v-flex>
	</v-layout>

	<v-flex xs12 v-else-if="isTableArray">
		<table class="v-datatable v-table theme--light">
			<thead>
			<tr>
				<th v-for="_field in field.fields">{{getLabel(_field)}}</th>
				<th>X</th>
			</tr>
			</thead>
			<tbody>
			<tr v-for="(val, index) in model[field.key]" :key="index" class="text-md-center">
				<td v-for="_field in field.fields" class="input-group-sm">
					<g-field :field="makeTableCell(_field)" :model="model[field.key][index]" :in-array="true"/>
				</td>
				<td>
					<v-icon @click="model[field.key].splice(index, 1)">delete</v-icon>
				</td>
			</tr>
			</tbody>
		</table>
		<v-btn color="primary" small depressed class="add-btn" @click="addObjectItem()">Add {{getLabel(field)}}</v-btn>
		<slot name="btn-append"></slot>
	</v-flex>


</template>

<script>
  import {Fragment} from 'vue-fragment';
  import {upperFirst, filter, values, assign, cloneDeep, map} from 'lodash-es';

  const _ = {upperFirst, filter, values, assign, cloneDeep, map};

  import {
    VTabs,
    VTab,
    VTabItem,
    VLayout,
    VFlex,
    VMenu,
    VBtn,
    VList,
    VListTile,
    VListTileTitle,
    VIcon
  } from 'vuetify/lib';
  import Vue from 'vue';

  export default {
    components: {
      Fragment, VTabs, VTab, VTabItem, VLayout, VFlex,
      VMenu, VBtn, VList, VListTile, VListTileTitle, VIcon
    },
    name: 'GField',
    props: ['model', 'fields', 'field', 'tabs', 'inArray', 'noLayout'],
    computed: {
      noPanel() {
        return this.field.noPanel;
      },
      isChoiceArray() {
        return !!(this.field && this.field.type === 'choiceArray');
      },
      isArray() {
        return !!(this.field && (this.field.type === 'array' || this.field.type === 'tableArray'));
      },
      isSimpleArray() {
        return !!(this.field && this.field.type === 'array' && this.field.fields.length === 1);
      },
      isObjectArray() {
        return !!(this.field && this.field.type === 'array' && this.field.fields);
      },
      isChoice() {
        return !!(this.field && this.field.type === 'choice');
      },
      isObject() {
        return !!(this.field && this.field.type.split('@')[0] === 'object');
      },
      _model() {
        if (typeof this.field.key !== 'undefined') return this.model[this.field.key];
        return this.model;
      },
      isTableArray() {
        return !!(this.field && this.field.type === 'tableArray');
      },
      isTableCellObject() {
        return false;
      },
      label() {
        if (this.field.label) {
          return this.field.label;
        }
        if (this.field.key) {
          return _.upperFirst(this.field.key);
        }
        return _.upperFirst(this.model.choice);
      },
      type() {
        const _type = Vue.$gform.mapping[this.field.type.split('@')[0]];
        if (!_type) return this.field.type;
        return _type;
      },
      choiceKey() {
        return this.field.choiceKey || 'choice';
      },
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
      choiceBtnPrepend() {
        if (this.field.choiceKeyOutside) return 'Choose';
        return 'Add'
      },
      _fields() {
        if (typeof this.field.dynamicFields === 'function') {
          try {
            return this.field.dynamicFields(this);
          } catch (e) {
            return [];
          }
				} else if (this.field.dynamicFields && Vue.$gform.resolver) {
          const resolver = Vue.$gform.resolver;
          const fields = [];
          if (this.field.fields) fields.push(...this.field.fields);
          fields.push(...resolver(this.field.dynamicFields));
          return fields;
        }
        return this.field.fields;
      }
    },
    methods: {
      getTabs() {
        const basic = _.filter(this.fields, f => ![].concat(..._.values(this.tabs)).includes(f.key)).map(f => f.key);
        return _.map(_.assign({}, basic.length > 0 ? {basic} : {}, this.tabs), (tabFields, name) => {
          return {name, fields: _.filter(this.fields, f => tabFields.includes(f.key))};
        });
      },
      createHeaders() {
        return this.field.fields.map(f => _.assign(f, {sortable: false}));
      },
      createArrayField(fields, $index) {
        return _.assign(_.cloneDeep(fields[0]), {key: $index, flex: this.field.flex, label: this.label});
      },
      createObjectArrayField(fields, index) {
        return {key: index, type: 'object', label: this.label, fields};
      },
      createChoiceArrayField(index) {
        return {key: index, type: 'choice', choiceKey: this.field.choiceKey, label: this.field.label, fields: this.field.fields};
      },
      createChoiceField() {
        let field = _.cloneDeep(this._fields.find(choice => this.getChoiceName(choice) === this.choiceModel[this.choiceKey]));
        /*if (!['array', 'object', 'tableArray', 'input', 'input@number', 'input@multiSelect'].includes(field.type)) {
          field = {
            label: this.choiceModel[this.choiceKey],
            type: 'object', fields: [_.assign(field, {key: this.field.key})]
          }
        } else */
        if (field.type === 'object') {
          delete field.key;
        } else {
          field.key = this.field.key;
        }

        return field;
      },
      addItem() {
        if (!this.model[this.field.key]) this.$set(this.model, this.field.key, []);
        this.model[this.field.key].push(null);
      },
      addObjectItem() {
        if (!this.model[this.field.key]) this.$set(this.model, this.field.key, []);
        this.model[this.field.key].push({});
      },
      makeTableCell(field) {
        return _.assign(field, {tableCell: true});
      },
      getLabel(field) {
        if (field.label) {
          return field.label;
        }
        return _.upperFirst(field.key);
      },
      selectChoice(choice) {
        this.$set(this.choiceModel, this.choiceKey, this.getChoiceName(choice));
      },
      getChoiceName(choice) {
        return choice.choiceName || choice.key;
      },
      selectChoiceInArray(choice) {
        if (!this.model[this.field.key]) this.$set(this.model, this.field.key, []);
        this.model[this.field.key].push({[this.choiceKey]: this.getChoiceName(choice)});
      },
      removeChoice() {
        if (this.inArray) {
          this.$emit('remove-field');
        } else {
          if (this.field.choiceKeyOutside) {
            const fields = this.createChoiceField().fields;
            fields && fields.map(v => v.key).forEach(k => {
              delete this.model[k];
            })
            if (this.model[this.field.key]) this.$set(this.model, this.field.key, null);
            this.$set(this.model, this.choiceKey, null);
          } else {
            this.$set(this.model, this.field.key, null);
          }
        }
      }
    },
    created() {
      //make sure that the 'value' is always set
      const setProperty = field => {
        if (field.key && typeof this.model[field.key] === 'undefined') {
          if (field.type.split('@')[0] === 'object') {
            this.$set(this.model, field.key, {});
          } else if (['array', 'tableArray', 'choiceArray'].includes(field.type)) {
            this.$set(this.model, field.key, []);
          } else if (!['choice'].includes(field.type)) {
            this.$set(this.model, field.key, null);
          }
        }
      };

      if (this.fields) {
        this.fields.forEach(setProperty);
      } else if (!this.fields && this.field) {
        setProperty(this.field);
      }
    },
    inject: {
      rootModel: {default: null},
      path: {default: null}
    },
    provide() {
      if (this.rootModel) {
        if (!this.field) {
          return null;
        }
        const path = this.path ? `${this.path}.${this.field.key}` : this.field.key;
        return {
          path
        };
      }
      return {
        noLayout: this.noLayout,
        rootModel: this.model
      };
    }
  };
</script>

<style scoped lang="scss">
	.v-datatable.v-table thead tr {
		height: 40px;
	}

	.v-datatable.v-table tbody td {
		height: 44px;
	}

	.theme--light.v-table {
		//background-color: transparent;
	}

	fieldset {
		padding: 0 10px 10px 10px;
		position: relative;
		top: 0;
		border: 1px solid #eee;
		border-radius: 4px;
		background-color: rgba(128, 128, 128, 0.03);
		width: 100%;
		margin-bottom: 20px;
	}

	legend {
		color: #337ab7;
		border: 0;
		margin-left: 10px;
		width: initial;
		padding: 0 5px;
		font-size: 1.4em;
		font-weight: 300;
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

		.v-icon {
			font-size: 0.9em;
			color: #6d6d6d;
		}
	}

</style>
