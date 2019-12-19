<template>
  <g-col :class="[flex,paddingClass]" v-if="inputType === 'switch'">
    <g-switch :label="field.tableCell ? '': label" v-model="internalValue"/>
  </g-col>
  <g-col :class="[flex,paddingClass]" class="row-flex align-items-center" v-else-if="inputType === 'checkbox'">
    <g-checkbox color="primary" :label="field.tableCell ? '': label" v-model="internalValue"/>
  </g-col>
  <g-col :class="[flex,paddingClass]" v-else-if="inputType === 'select' || inputType === 'select:number'">
    <component :is="field.notOnlyValueInOptions ? 'g-combobox': 'g-autocomplete'" v-model="internalValue"
               :items="options"
               :item-text="field.itemText" :item-value="field.itemValue"
               :chips="field.chips" :small-chips="field.chips"
               :label="field.tableCell ? '': label" clearable
               @change="onChange"
               :return-object="!!field.returnObject"
               :menu-props="{'z-index': 1000, 'closeOnContentClick': true}">
      <g-icon slot="append-inner" v-if="inArray" @click.stop="removeField">delete_outline</g-icon>
    </component>
  </g-col>
  <g-col :class="[flex,paddingClass]"
         v-else-if="inputType === 'multiSelect' || inputType === 'multiSelect:number'">
    <g-combobox
      v-model="internalValue"
      :item-text="field.itemText" :item-value="field.itemValue"
      :items="options"
      hide-selected
      :label="field.tableCell ? '': label"
      multiple
      small-chips
      deletable-chips
      :return-object="!!field.returnObject"
      :menu-props="{'z-index': 1000, 'closeOnContentClick': true}">
      <g-icon slot="append-inner" v-if="inArray" @click.stop="removeField">delete_outline</g-icon>
    </g-combobox>
  </g-col>
  <input v-else-if="field.tableCell" :type="inputType" v-model="internalValue" class="form-control">
  <g-col :class="[flex,paddingClass]" v-else>
    <g-text-field v-model="internalValue" :label="label" :type="inputType">
      <g-icon slot="append-inner" v-if="field.addable" style="opacity: 0.4" @click.stop="clearValue()">clear</g-icon>
      <g-icon slot="append-inner" v-if="inArray" @click.stop="removeField">delete_outline</g-icon>
    </g-text-field>
  </g-col>
</template>
<script>
  //not required but this baseField has a lot of useful stuff already in it, check it out
  import {Fragment} from 'vue-fragment';
  import {upperFirst, get} from 'lodash-es';
  import dayjs from 'dayjs';

  const _ = {upperFirst, get};

  export default {
    components: {Fragment},
    name: 'GInput',
    props: ['model', 'field', 'inArray', 'noFlex', 'rootModel', 'path', 'noLayout'],
    computed: {
      paddingClass() {
        return this.field.tableCell ? 'px-0' : 'px-2';
      },
      internalValue: {
        get() {
          try {
            if (this.inputType === 'date') {
              return this.model[this.field.key] && dayjs(this.model[this.field.key]).format('YYYY-MM-DD');
            } else if (this.inputType === 'datetime-local') {
              return this.model[this.field.key] && dayjs(this.model[this.field.key]).format('YYYY-MM-DD[T]HH:mm');
            }
          } catch (e) {
          }
          return this.model[this.field.key];
        },
        set(v) {
          if (this.inputType.includes('number')) {
            this.$set(this.model, this.field.key, parseFloat(v))
          } else if (this.inputType === 'date') {
            this.$set(this.model, this.field.key, new Date(v + 'T00:00:00'))
          } else if (this.inputType === 'datetime-local') {
            this.$set(this.model, this.field.key, new Date(v))
          } else {
            this.$set(this.model, this.field.key, v)
          }
        }
      },
      inputType() {
        if (this.field.type.includes('@')) {
          return this.field.type.split('@')[1];
        }
        return _.get(this.field, 'inputType', 'text');
      },
      label() {
        if (this.field.label) {
          return this.field.label;
        }
        return _.upperFirst(this.field.key);
      },
      options() {
        if (typeof this.field.options === 'function') {
          return this.field.options(this);
        }
        if (this.inputType.includes('number')) {
          return this.field.options.map(opt => {
            if (typeof opt === 'object') return Object.assign(opt, {value: parseFloat(opt.value)});
            return parseFloat(opt);
          });
        }
        return this.field.options;
      },
      flex() {
        return this.noLayout ? 'col-xs-12' : this.field.flex;
      }
    },
    created() {
      if (this.field.default && typeof this.field.default !== 'function' && !this.model[this.field.key]) {
        if (this.inputType.includes('number')) {
          this.$set(this.model, this.field.key, parseFloat(this.field.default));
        } else {
          this.$set(this.model, this.field.key, this.field.default);
        }
      } else if (this.field.default && typeof this.field.default === 'function' && !this.model[this.field.key]) {
        this.$set(this.model, this.field.key, this.field.default());
      } else if (!this.model.hasOwnProperty(this.field.key)) {
        this.$set(this.model, this.field.key, undefined);
      }
    },
    methods: {
      clearValue() {
        this.model[this.field.key] = undefined;
      },
      onChange(e) {
        if (this.field.onChange) {
          this.field.onChange(e, this.rootModel, this.model);
        }
      },
      removeField() {
        //this.model.splice(this.field.key, 1);
        this.$emit('remove-field');
      }
    },
    inject: {
      //noLayout: { default: null }
    }
  };
</script>

<style lang="scss">
  @import "~bootstrap/scss/functions";
  @import "~bootstrap/scss/variables";
  @import "~bootstrap/scss/mixins";
  @import "~bootstrap/scss/forms";

  table.gfield-table tr:not(.g-expansion) {
    .g-combobox, .g-autocomplete, .g-date-picker {
      .g-tf-wrapper {
        height: 38px;
        border-radius: 4px;
        border: 1px solid #ced4da;
        background-color: white;
      }

      .g-tf-input {
        font-size: 0.9rem;
        padding-left: 10px;
      }

      .g-tf {
        .inputGroup {
          min-width: 80px;
        }

        &::before {
          display: none;
        }
      }

      fieldset {
        border: none;
      }

      .g-tf-append__inner {
        padding-left: 0;

        .g-icon__clear {
          display: none !important;
        }
      }
    }
  }
</style>
