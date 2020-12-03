<template>
  <g-col xs12 v-for="(val, index) in model[field.key]" :key="index">
    <g-field @remove-field="_model.splice(index, 1)" :in-array="true" :no-layout="false"
             :path="genPath(field.key)" :root-model="rootModel"
             :field="createArrayField(field.fields, index)" :model="model[field.key]"></g-field>
  </g-col>
  <g-col xs12>
    <g-btn textColor="blue lighten-2" outlined small @click="addItem()">
      Add {{label}}
    </g-btn>
    <slot name="btn-append"></slot>
  </g-col>
</template>

<script>
  import {_fieldsFactory, _modelFactory, flexFactory, genPath, labelFactory} from './FormFactory';
  import _ from 'lodash';

  export default {
    name: 'GFieldSimpleArray',
    props: ['model', 'field', 'path', 'rootModel', 'noLayout'],
    data: function () {
      return {}
    },
    setup(props, context) {
      const _model = _modelFactory(props);
      const flex = flexFactory(props)
      const label = labelFactory(props);
      const _fields = _fieldsFactory(props);

      return {_model, flex, label, _fields}
    },
    computed: {},
    methods: {
      genPath,
      createArrayField(fields, $index) {
        return _.assign(_.cloneDeep(fields[0]), {key: $index, flex: this.field.flex, label: this.label});
      },
      addItem() {
        if (!this.model[this.field.key]) this.$set(this.model, this.field.key, []);
        this.model[this.field.key].push(null);
      }
    }
  }
</script>

<style scoped>

</style>
