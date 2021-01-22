<template>
  <div class="col-flex col-xs-12">
<!--    <g-row no-gutters>-->
      <template v-for="val in model[field.key]">
        <div class="col-flex"
             :class="[flex, flex !== 'col-xs-12' ? 'fix-inline': '']"
             style="position: relative">
          <g-field-object :field="createObjectArrayField(field.fields, val)" :model="model[field.key]"
                          :in-array="true" :rootModel="rootModel" :path="genPath(field.key)" :no-layout="noLayout">
            <template #action="{collapse}">
              <g-card background-color="white" class="action-container" :elevation="0">
                <g-btn xSmall icon @click="pushItemUp(val)">
                  <g-icon small>
                    keyboard_arrow_up
                  </g-icon>
                </g-btn>
                <g-btn xSmall icon @click="pushItemDown(val)">
                  <g-icon small>
                    keyboard_arrow_down
                  </g-icon>
                </g-btn>
                <g-btn xSmall icon @click="deleteItem(val)">
                  <g-icon small>delete</g-icon>
                </g-btn>
              </g-card>
            </template>
          </g-field-object>
        </div>
      </template>
<!--    </g-row>-->
    <g-btn class="ma-2" textColor="blue lighten-2" outlined small @click="addObjectItem" v-if="!field.addable">
      ADD {{getLabel(field).toUpperCase()}}
    </g-btn>
  </div>
</template>

<script>
  import {
    _fieldsFactory,
    _modelFactory,
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
      const internalModel = _modelFactory(props);
      const flex = flexFactory(props);
      const label = labelFactory(props);
      const fields = _fieldsFactory(props, gForm);

      return {internalModel, flex, label, fields}
    },
    computed: {},
    methods: {
      genPath,
      getLabel,
      addObjectItem() {
        if (!this.model[this.field.key] || !Array.isArray(this.model[this.field.key])) this.model[this.field.key] = []
        this.model[this.field.key].push({})
      },
      createObjectArrayField(fields, val) {
        const index = this.model[this.field.key].indexOf(val)
        return {key: index, type: 'object', label: this.label, fields };
      },
      pushItemDown(val) {
        const model = this.model[this.field.key]
        const index = model.indexOf(val)
        const itemsLength = model && model.length
        if (!itemsLength || isNaN(index) || index === itemsLength - 1) return

        const newModel = _.clone(model)
        const temp = newModel[index]
        newModel[index] = newModel[index + 1]
        newModel[index + 1] = temp

        model.splice(0, model.length, ...newModel)
      },
      pushItemUp(val) {
        const model = this.model[this.field.key]
        const index = model.indexOf(val)
        const itemsLength = model && model.length
        if (!itemsLength || isNaN(index) || index === 0) return

        const newModel = _.clone(model)
        const temp = newModel[index]
        newModel[index] = newModel[index - 1]
        newModel[index - 1] = temp

        model.splice(0, model.length, ...newModel)
      },
      deleteItem(val) {
        const model = this.model[this.field.key]
        const index = model.indexOf(val)
        model.splice(index, 1)
      }
    }
  }
</script>

