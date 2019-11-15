<template>
	<v-tabs style="width: 100%" v-if="tabs" :class="{'tab-wrapper': fillHeight}">
		<v-tab v-for="tab in getTabs()" :key="tab.name">{{tab.name}}</v-tab>
		<v-tab-item v-for="tab in getTabs()" :key="tab.name" style="padding-top: 20px;">
			<g-field :fields="tab.fields" :model="model" :path="path" :no-layout="noLayout"
							 :fill-height="fillHeight" :rootModel="_rootModel"/>
		</v-tab-item>
		<slot name="tab-append"></slot>
	</v-tabs>

	<v-layout row wrap :fill-height="fillHeight" v-else-if="fields">
		<g-field v-for="(_field, index) in getFormFields()" :key="_field.key + index"
						 :path="path"
						 :field="_field" :model="model" :rootModel="_rootModel" :no-layout="noLayout"
						 v-show="isVisible(_field)"/>
		<v-flex xs12>
			<v-chip v-for="(addField, index) in getAddFields()" v-show="isVisible(addField)" :key="addField.key + index"
							color="#4dd8a7" text-color="white" @click="addNullValue(addField)">
				<v-avatar>
					<v-icon>add_circle</v-icon>
				</v-avatar>
				{{addField.label || addField.key}}
			</v-chip>
		</v-flex>
	</v-layout>

	<!--todo: object navigate-->
	<component v-else :is="type" v-on="$listeners"
						 :rootModel="_rootModel" :path="path"
						 :model="model" :field="field" :in-array="inArray" :no-layout="noLayout">
		<slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>
	</component>
</template>

<script>
  import { Fragment } from 'vue-fragment';
  import { upperFirst, filter, values, assign, cloneDeep, map } from 'lodash-es';

  const _ = { upperFirst, filter, values, assign, cloneDeep, map };

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
    VIcon,
    VExpandTransition
  } from 'vuetify/lib';
  import Vue from 'vue';
  import ExtendPath from './ExtendPath';
  import { _modelFactory, _rootModelFactory, addObjectItem, flexFactory, genPath, getLabel, labelFactory } from './FormFactory';

  export default {
    components: {
      ExtendPath,
      Fragment, VTabs, VTab, VTabItem, VLayout, VFlex,
      VMenu, VBtn, VList, VListTile, VListTileTitle, VIcon
    },
    name: 'GField',
    props: {
      model: null,
      rootModel: null,
      path: String,
      fields: Array,
      field: Object,
      tabs: null,
      inArray: Boolean,
      noLayout: Boolean,
      domain: String,
      fillHeight: Boolean,
    },
    domain: ':domain',
    setup(props, context) {
      const _model = _modelFactory(props);
      const flex = flexFactory(props)
      const label = labelFactory(props);
      const _rootModel = _rootModelFactory(props);
      return { _model, flex, label, getLabel, _rootModel }
    },
    computed: {
      type() {
        const _type = Vue.$gform.resolveField(this.field);
        if (!_type) return this.field.type;
        return _type;
      },
    },
    methods: {
      genPath: genPath,
      getFormFields() {
        return this.fields.filter(f => {
          if (!f.addable) return true;
          if (typeof this.model[f.key] === 'undefined') return false;
          return true;
        })
      },
      getAddFields() {
        return this.fields.filter(f => {
          if (!f.addable) return false;
          if (typeof this.model[f.key] === 'undefined') return true;
          if (f.type.includes('array') || f.type.includes('Array')) {
            return true;
          }
          return false;
        })
      },
      addNullValue(field) {
        if (field.type.includes('array') || field.type.includes('Array')) {
          if (!this.model[field.key]) this.$set(this.model, field.key, []);
          this.model[field.key].push({});
        } else if (field.type && field.type.split('@')[0] === 'object') {
          this.model[field.key] = {};
        } else {
          this.model[field.key] = null;
        }
      },
      getTabs() {
        const basic = _.filter(this.fields, f => ![].concat(..._.values(this.tabs)).includes(f.key)).map(f => f.key);
        return _.map(_.assign({}, basic.length > 0 ? { basic } : {}, this.tabs), (tabFields, name) => {
          return { name, fields: _.filter(this.fields, f => tabFields.includes(f.key)) };
        });
      },
      isVisible(field) {
        if (!field.isVisible) return true;
        return field.isVisible(this);
      },
      setProperty(field) {
        if (field.key && !this.model.hasOwnProperty(field.key)) {
          if (field.type && field.type.split('@')[0] === 'object' && !field.addable) {
            this.$set(this.model, field.key, {});
          } else if (['array', 'tableArray', 'choiceArray'].includes(field.type)) {
            this.$set(this.model, field.key, []);
          } else if (!['choice'].includes(field.type)) {
            this.$set(this.model, field.key);
          }
        }
      }
    },
    created() {
      if (this.fields) {
        this.fields.forEach(this.setProperty);
      } else if (!this.fields && this.field) {
        this.setProperty(this.field);
      }
    },
  };
</script>
