<template>
  <g-col xs12>
    <div v-if="choiceExist">
      <g-col xs12>
        <g-field :field="choiceField" :model="choiceModel" @remove-field="removeChoice" :in-array="true"
                 :root-model="rootModel" :path="choicePath" :no-layout="noLayout">
          <template slot="action">
            <g-btn icon depressed class="remove-btn" @click="removeChoice()">
              <g-icon>delete</g-icon>
            </g-btn>
          </template>
          <template slot="btn-append">
            <g-btn v-if="!inArray" icon depressed textColor="gray" @click="removeChoice()">
              <g-icon>delete_outline</g-icon>
            </g-btn>
          </template>
        </g-field>
      </g-col>
    </div>
    <g-menu offset-y v-if="!choiceExist" z-index="1000" v-model="showMenu" :closeOnContentClick="true">
      <template #activator="{toggleContent}">
        <g-btn @click="toggleContent" textColor="blue lighten-2" outlined small>
          {{choiceBtnPrepend.toUpperCase()}} {{getLabel(field).toUpperCase()}}
          <g-icon>arrow_drop_down</g-icon>
        </g-btn>
      </template>
      <g-list :items="_fields">
        <template #list-item="{item}">
          <g-list-item :item="item" @singleItemClick="selectChoice(item)">
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

  export default {
    name: 'GFieldChoice',
    props: ['model', 'field', 'inArray', 'rootModel', 'path', 'noLayout'],
    data: function () {
      return {
        showMenu: false,
      }
    },
    setup(props, context) {
      const _model = _modelFactory(props);
      const flex = flexFactory(props);
      const label = labelFactory(props);
      const _fields = _fieldsFactory(props);

      return {_model, flex, label, _fields}
    },
    computed: {
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
      choicePath() {
        if (this.field.choiceKeyOutside) return this.path;
        return this.genPath(this.field.key)
      },
      choiceBtnPrepend() {
        if (this.field.choiceKeyOutside) return 'Choose';
        return 'Add'
      },
      choiceKey() {
        return this.field.choiceKey || 'choice';
      },
      choiceField() {
        let field = _.cloneDeep(this._fields.find(choice => this.getChoiceName(choice) === this.choiceModel[this.choiceKey]));
        /*if (!['array', 'object', 'tableArray', 'input', 'input@number', 'input@multiSelect'].includes(field.type)) {
          field = {
            label: this.choiceModel[this.choiceKey],
            type: 'object', fields: [_.assign(field, {key: this.field.key})]
          }
        } else */
        if (field.type === 'object') {
          field.label = field.label || field.key;
          delete field.key;
        } else {
          field.key = this.field.key;
        }

        return field;
      }
    },
    methods: {
      genPath,
      getLabel,
      removeChoice() {
        if (this.inArray) {
          this.$emit('remove-field');
        } else {
          if (this.field.choiceKeyOutside) {
            const fields = this.choiceField.fields;
            fields && fields.map(v => v.key).forEach(k => {
              delete this.model[k];
            })
            if (this.model[this.field.key]) this.$set(this.model, this.field.key, null);
            this.$set(this.model, this.choiceKey, null);
          } else {
            this.$set(this.model, this.field.key, null);
          }
        }
      },
      selectChoice(choice) {
        this.$set(this.choiceModel, this.choiceKey, this.getChoiceName(choice));
      },
      getChoiceName,
    }
  }
</script>

<style lang="scss">
  .fieldset__collapsed .remove-btn {
    top: 10px !important;
  }
</style>
