<template>
  <div v-for="(val, index) in model[field.key]"
       class="col-flex col-xs-12"
       :key="index">
    <g-field @remove-field="internalModel.splice(index, 1)" :in-array="true" :no-layout="false"
             :path="genPath(field.key)" :root-model="rootModel"
             :field="createArrayField(field.fields, index)" :model="model[field.key]"></g-field>
  </div>
  <div class="col-flex col-xs-12">
    <g-btn textColor="blue lighten-2" outlined small @click="addItem()">
      Add {{ label }}
    </g-btn>
    <slot name="btn-append"></slot>
  </div>
</template>

<script>
  import {_fieldsFactory, _modelFactory, flexFactory, genPath, labelFactory} from './FormFactory';
  import _ from 'lodash';

  export default {
    name: 'GFieldSimpleArray',
    props: ['model', 'field', 'path', 'rootModel', 'noLayout'],
    inheritAttrs: false,
    data: function () {
      return {}
    },
    setup(props, context) {
      const internalModel = _modelFactory(props);
      const flex = flexFactory(props)
      const label = labelFactory(props);
      const fields = _fieldsFactory(props);

      return {internalModel, flex, label, fields}
    },
    computed: {},
    methods: {
      genPath,
      createArrayField(fields, $index) {
        return _.assign(_.cloneDeep(fields[0]), {key: $index, flex: this.field.flex, label: this.label});
      },
      addItem() {
        if (!this.model[this.field.key]) this.model[this.field.key] = []
        this.model[this.field.key].push(null);
      }
    }
  }
</script>

<style scoped>

</style>
