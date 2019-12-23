<template>
  <g-tabs slider-color="primary" style="width: 100%" v-if="tabs" :items="tabsData" :class="{'tab-wrapper': fillHeight}"
          v-model="activeTab">
    <template #tab="{item}">
      <g-tab :key="item.name" :item="item">{{item.name}}</g-tab>
    </template>
    <template #default>
      <g-tab-item class="pt-3" v-for="tab in tabsData" :key="tab.name" :item="tab">
        <g-field :fields="tab.fields" :model="model" :path="path" :no-layout="noLayout" :fill-height="fillHeight"
                 :rootModel="_rootModel"/>
      </g-tab-item>
      <slot name="tab-append"></slot>
    </template>
  </g-tabs>

  <g-row no-gutters :class="fillHeight ? 'fill-height' : ''" v-else-if="fields">
    <g-field v-for="(_field, index) in getFormFields()" :key="'field_' + _field.key + '_' + index"
             :path="path"
             :field="_field" :model="model" :rootModel="_rootModel" :no-layout="noLayout"
             v-show="isVisible(_field)"/>
    <g-col xs12>
      <g-chip v-for="(addField, index) in getAddFields()" v-show="isVisible(addField)" :key="addField.key + index"
              backgroundColor="#e5efff" textColor="primary" @click="addNullValue(addField)">
        <g-avatar class="g-avatar__left">
          <g-icon color="primary">add_circle</g-icon>
        </g-avatar>
        {{addField.label || addField.key}}
      </g-chip>
    </g-col>
  </g-row>

  <!--todo: object navigate-->
  <component v-else :is="type" v-on="$listeners"
             :rootModel="_rootModel" :path="path" :collapse-states="collapseStates"
             :model="model" :field="field" :in-array="inArray" :no-layout="noLayout">
    <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>
  </component>
</template>

<script>
  import { Fragment } from 'vue-fragment';
  import { upperFirst, filter, values, assign, cloneDeep, map } from 'lodash-es';
  import Vue from 'vue';

  const _ = { upperFirst, filter, values, assign, cloneDeep, map };

  import {
    _modelFactory,
    _rootModelFactory,
    flexFactory,
    genPath,
    getLabel,
    labelFactory
  } from './FormFactory';

  export default {
    components: {
      Fragment,
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
      collapseStates: Object,
    },
    data() {
      return {
        tabsData: Array,
        activeTab: Object,
      }
    },
    domain: ':domain',
    setup(props, context) {
      const _model = _modelFactory(props);
      const flex = flexFactory(props);
      const label = labelFactory(props);
      const _rootModel = _rootModelFactory(props);

      return { _model, flex, label, getLabel, _rootModel }
    },
    computed: {
      type() {
        if (!this.field.type) return null;
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
          return typeof this.model[f.key] !== 'undefined';
        })
      },
      getAddFields() {
        return this.fields.filter(f => {
          if (!f.addable) return false;
          if (typeof this.model[f.key] === 'undefined') return true;
          return !!(f.type.includes('array') || f.type.includes('Array'));
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
      this.tabsData = this.getTabs();
      this.activeTab = this.tabsData[0];

      if (this.fields) {
        this.fields.forEach(this.setProperty);
      } else if (!this.fields && this.field) {
        this.setProperty(this.field);
      }
    },
  };
</script>
<style scoped lang="scss">
  ::v-deep .g-tab-items {
    overflow: visible;
  }
</style>
