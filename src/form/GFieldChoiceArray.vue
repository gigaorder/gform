<template>
  <fragment>
    <g-col :class="[flex]" v-for="(val, index) in model[field.key]" :key="index">
      <g-field-choice @remove-field="model[field.key].splice(index, 1)" :in-array="true"
                      :rootModel="rootModel" :path="genPath(field.key)"
                      :field="createChoiceArrayField(index)" :model="model[field.key]"
                      :no-layout="noLayout"></g-field-choice>
    </g-col>
    <g-col md12>
      <g-menu offset-y v-if="!inArray" z-index="1000" v-model="showMenu" :closeOnContentClick="true">
        <template #activator="{toggleContent}">
          <g-btn @click="toggleContent" backgroundColor="blue" textColor="white" small>
            ADD {{getLabel(field).toUpperCase()}}
            <g-icon>arrow_drop_down</g-icon>
          </g-btn>
        </template>
        <g-list :items="_fields">
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
  </fragment>
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

  export default {
    name: 'GFieldChoiceArray',
    props: ['model', 'field', 'inArray', 'rootModel', 'path', 'noLayout'],
    data: function () {
      return {
        showMenu: false,
      }
    },
    setup(props, context) {
      const _model = _modelFactory(props);
      const flex = flexFactory(props)
      const label = labelFactory(props);
      const _fields = _fieldsFactory(props);

      return {_model, flex, label, _fields}
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
        this.model[this.field.key].push({[this.choiceKey]: this.getChoiceName(choice)});
      },
    }
  }
</script>

<style scoped>

</style>
