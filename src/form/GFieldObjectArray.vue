<template>
  <g-col xs12>
    <g-row no-gutters>
      <g-col :class="[flex, flex !== 'col-xs-12' ? 'fix-inline': '']" v-for="(val, index) in model[field.key]"
             :key="index"
             style="position: relative">
        <g-field-object :field="createObjectArrayField(field.fields, index)" :model="model[field.key]"
                        :in-array="true" :rootModel="rootModel" :path="genPath(field.key)" :no-layout="noLayout">
          <template #action="{collapse}">
            <g-card background-color="white" class="action-container" :elevation="0">
              <g-btn xSmall icon @click="pushItemUp(index)">
                <g-icon small>
                  keyboard_arrow_up
                </g-icon>
              </g-btn>
              <g-btn xSmall icon @click="pushItemDown(index)">
                <g-icon small>
                  keyboard_arrow_down
                </g-icon>
              </g-btn>
              <g-btn xSmall icon @click="model[field.key].splice(index, 1)">
                <g-icon small>delete</g-icon>
              </g-btn>
            </g-card>
          </template>
        </g-field-object>
      </g-col>
    </g-row>
    <g-btn class="ma-2" textColor="blue lighten-2" outlined small @click="addObjectItem()" v-if="!field.addable">
      ADD {{getLabel(field).toUpperCase()}}
    </g-btn>
  </g-col>
</template>

<script>
  import {
    _fieldsFactory,
    _modelFactory,
    addObjectItem,
    flexFactory,
    genPath,
    getLabel,
    labelFactory
  } from './FormFactory';
  import _ from 'lodash';
  import { inject } from 'vue';

  export default {
    name: 'GFieldObjectArray',
    props: ['model', 'field', 'rootModel', 'path', 'noLayout'],
    data: function () {
      return {}
    },
    setup(props) {
      const gForm = inject('$gform')
      const _model = _modelFactory(props);
      const flex = flexFactory(props);
      const label = labelFactory(props);
      const _fields = _fieldsFactory(props, gForm);

      return {_model, flex, label, _fields}
    },
    computed: {},
    methods: {
      genPath,
      getLabel,
      addObjectItem,
      createObjectArrayField(fields, index) {
        return {key: index, type: 'object', label: this.label, fields};
      },
      pushItemDown(index) {
        const model = this.model[this.field.key]
        index = parseInt(index)
        const itemsLength = model && model.length
        if (!itemsLength || isNaN(index) || index === itemsLength - 1) return

        const newModel = _.clone(model)
        const temp = newModel[index]
        newModel[index] = newModel[index + 1]
        newModel[index + 1] = temp

        model.splice(0, model.length, ...newModel)
      },
      pushItemUp(index) {
        const model = this.model[this.field.key]
        index = parseInt(index)
        const itemsLength = model && model.length
        if (!itemsLength || isNaN(index) || index === 0) return

        const newModel = _.clone(model)
        const temp = newModel[index]
        newModel[index] = newModel[index - 1]
        newModel[index - 1] = temp

        model.splice(0, model.length, ...newModel)
      }
    }
  }
</script>

