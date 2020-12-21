<template>
  <g-field :path="path" v-if="metadata" :fields="resolveMetadata()" :model="model" :no-layout="noLayout"/>

  <g-tabs slider-color="primary" style="width: 100%" v-else-if="tabs" :items="Object.keys(getTabs())"
          :class="{'tab-wrapper': fillHeight}"
          v-model="activeTab">
    <template #tabs>
      <template v-for="(tab, index) in getTabs()" :key="tab.name">
        <g-tab :item="`${index}`">{{ tab.name }}</g-tab>
      </template>
    </template>
    <template #default>
      <template v-for="(tab, index) in getTabs()" :key="tab.name">
        <g-tab-item class="pt-3" :item="`${index}`">
          <g-field :fields="tab.fields" :model="model" :path="path" :no-layout="noLayout" :fill-height="fillHeight"
                   :rootModel="internalRootModel"/>
        </g-tab-item>
      </template>
      <slot name="tab-append"></slot>
    </template>
  </g-tabs>

  <g-row no-gutters :class="fillHeight ? 'fill-height' : ''" v-else-if="fields">
    <template v-for="(_field, index) in getFormFields()" :key="'field_' + _field.key + '_' + index">
      <g-field :path="path"
               :field="_field" :model="model" :rootModel="internalRootModel" :no-layout="noLayout"
               v-show="isVisible(_field)"/>
    </template>
    <g-col xs12>
      <template v-for="(addField, index) in getAddFields()" :key="addField.key + index">
        <g-chip v-show="isVisible(addField)"
                backgroundColor="#e5efff" textColor="primary" @click="addNullValue(addField)">
          <g-avatar class="g-avatar__left">
            <g-icon color="primary">add_circle</g-icon>
          </g-avatar>
          {{ addField.label || addField.key }}
        </g-chip>
      </template>
    </g-col>
  </g-row>

  <!--todo: object navigate-->
  <component v-else :is="type"
             :rootModel="internalRootModel" :path="path"
             :model="model" :field="field" :in-array="inArray" :no-layout="noLayout" :fields="fields">
    <slot v-for="slot in Object.keys($slots)" :name="slot" :slot="slot"/>
  </component>
</template>

<script>
  import {upperFirst, filter, values, assign, cloneDeep, map} from 'lodash';
  import {
    _modelFactory,
    _rootModelFactory,
    flexFactory,
    genPath,
    getLabel,
    labelFactory
  } from './FormFactory';

  const _ = {upperFirst, filter, values, assign, cloneDeep, map};

  export default {
    name: 'GField',
    props: {
      model: null,
      rootModel: null,
      path: String,
      metadata: null,
      fields: Array,
      field: Object,
      tabs: null,
      inArray: Boolean,
      noLayout: Boolean,
      domain: String,
      fillHeight: Boolean,
      collapseStates: Object,
      preprocess: [Boolean, String]
    },
    inject: ['$gform'],
    data() {
      return {
        activeTab: '0',
      }
    },
    domain: ':domain',
    setup(props, context) {
      const internalModel = _modelFactory(props);
      const flex = flexFactory(props);
      const label = labelFactory(props);
      const internalRootModel = _rootModelFactory(props);
      return {internalModel, flex, label, getLabel, internalRootModel}
    },
    computed: {
      type() {
        if (!this.field.type) return null;
        const _type = this.$gform.resolveField(this.field);
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
          if (!this.model[field.key]) this.model[field.key] = []
          this.model[field.key].push({});
        } else if (field.type && field.type.split('@')[0] === 'object') {
          this.model[field.key] = {};
        } else {
          this.model[field.key] = null;
        }
      },
      getTabs() {
        const basic = _.filter(this.fields, f => ![].concat(..._.values(this.tabs)).includes(f.key)).map(f => f.key);
        return _.map(_.assign({}, basic.length > 0 ? {basic} : {}, this.tabs), (tabFields, name) => {
          return {name, fields: _.filter(this.fields, f => tabFields.includes(f.key))};
        });
      },
      isVisible(field) {
        if (!field.isVisible) return true;
        return field.isVisible(this);
      },
      setProperty(field) {
        if (field.key && !this.model.hasOwnProperty(field.key)) {
          if (field.type && field.type.split('@')[0] === 'object' && !field.addable) {
            this.model[field.key] = {}
          } else if (['array', 'tableArray', 'choiceArray'].includes(field.type)) {
            this.model[field.key] = []
          } else if (!['choice'].includes(field.type)) {
            this.model[field.key] = undefined
          }
        }
      },
      resolveMetadata() {
        const preprocess = this.preprocess;
        let result = this.fields;
        if (preprocess) {
          result = this.$gform.preprocess[typeof preprocess === 'string' ? preprocess : 'normalize'](this.metadata, result);
        }
        return result;
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
<style scoped lang="scss">
  ::v-deep .g-tab-items {
    overflow: visible;
  }
</style>
