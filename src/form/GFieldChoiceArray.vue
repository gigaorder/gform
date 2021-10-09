<template>
  <g-col :class="[flex]" v-for="(val, index) in model[field.key]" :key="index">
    <g-field-choice @remove-field="model[field.key].splice(index, 1)" :in-array="true"
                    :rootModel="rootModel" :path="genPath(field.key)"
                    :field="createChoiceArrayField(index)" :model.sync="model[field.key]"
                    :no-layout="noLayout"/>
  </g-col>
  <g-col md12>
    <g-menu offset-y v-if="!inArray" z-index="1000" v-model="showMenu" :closeOnContentClick="true">
      <template #activator="{toggleContent}">
        <g-btn @click="toggleContent" backgroundColor="blue" textColor="white" small>
          ADD {{getLabel(field).toUpperCase()}}
          <g-icon>arrow_drop_down</g-icon>
        </g-btn>
      </template>
      <g-list :items="fields">
        <template #list-item="{item}">
          <g-list-item :item="item" @singleItemClick="selectChoiceInArray(item)">
            <g-list-item-content>
              <g-list-item-text>{{ getChoiceName(item) }}</g-list-item-text>
            </g-list-item-content>
          </g-list-item>
        </template>
      </g-list>
    </g-menu>
  </g-col>
</template>

<script>
  import {
    _fieldsFactory,
    _modelFactory,
    flexFactory,
    genPath,
    getChoiceName,
    getLabel,
    labelFactory
  } from './FormFactory';
  import _ from 'lodash';
  import { inject } from 'vue';

  export default {
    name: 'GFieldChoiceArray',
    props: ['model', 'field', 'inArray', 'rootModel', 'path', 'noLayout'],
    inheritAttrs: false,
    data: function () {
      return {
        showMenu: false,
      }
    },
    setup(props, context) {
      const gForm = inject('$gform')
      const internalModel = _modelFactory(props);
      const flex = flexFactory(props)
      const label = labelFactory(props);
      const fields = _fieldsFactory(props, gForm);

      return {internalModel, flex, label, fields}
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
        return _.assign(_.cloneDeep(fields[0]), {key: $index, flex: this.field.flex, label: this.label});
      },
      addItem() {
        if (!this.model[this.field.key]) this.model[this.field.key] = []
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
        if (!this.model[this.field.key]) this.model[this.field.key] = []
        this.model[this.field.key].push({[this.choiceKey]: this.getChoiceName(choice)});
        console.log('this.model[this.field.key]', this.model[this.field.key])
      },
    }
  }
</script>
