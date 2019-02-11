<template>
  <v-flex :class="flex" class="px-2" v-if="inputType === 'switch'">
    <v-switch color="success" :label="field.tableCell ? '': label" v-model="model[field.key]"/>
  </v-flex>
  <v-flex :class="flex" class="px-2" v-else-if="inputType === 'checkbox'">
    <v-checkbox color="success" :label="field.tableCell ? '': label" v-model="model[field.key]"/>
  </v-flex>
  <v-flex :class="flex" class="px-2" v-else-if="inputType === 'select'">
    <v-autocomplete v-model="model[field.key]" :items="options" :label="field.tableCell ? '': label" clearable
                    @change="onChange"
                    :return-object="!!field.returnObject"
                    :menu-props="{'z-index': 1000, 'closeOnContentClick': true}">
      <v-icon slot="append" v-if="inArray" @click.stop="$emit('remove-field')">delete_outline</v-icon>
    </v-autocomplete>
  </v-flex>
  <v-flex :class="flex" class="px-2" v-else-if="inputType === 'select:number'">
    <v-autocomplete v-model.number="model[field.key]" :items="options" :label="field.tableCell ? '': label" clearable
                    :return-object="!!field.returnObject"
                    :menu-props="{'z-index': 1000, 'closeOnContentClick': true}">
      <v-icon slot="append" v-if="inArray" @click.stop="$emit('remove-field')">delete_outline</v-icon>
    </v-autocomplete>
  </v-flex>
  <v-flex :class="flex" class="px-2" v-else-if="inputType === 'multiSelect'">
    <v-combobox
      v-model="model[field.key]"
      :items="options"
      hide-selected
      :label="field.tableCell ? '': label"
      multiple
      small-chips
      deletable-chips
      :return-object="!!field.returnObject"
      :menu-props="{'z-index': 1000, 'closeOnContentClick': true}"
    >
      <v-icon slot="append" v-if="inArray" @click.stop="$emit('remove-field')">delete_outline</v-icon>
    </v-combobox>
  </v-flex>
  <v-flex :class="flex" class="px-2" v-else-if="inputType === 'multiSelect:number'">
    <v-combobox
      v-model.number="model[field.key]"
      :items="options"
      hide-selected
      :label="label"
      multiple
      small-chips
      deletable-chips
      :return-object="!!field.returnObject"
      :menu-props="{'z-index': 1000, 'closeOnContentClick': true}"
    >
      <v-icon slot="append" v-if="inArray" @click.stop="$emit('remove-field')">delete_outline</v-icon>
    </v-combobox>
  </v-flex>
  <input v-else-if="field.tableCell && inputType!== 'number'" :type="inputType" v-model="model[field.key]" class="form-control">
  <input v-else-if="field.tableCell && inputType=== 'number'" :type="inputType" v-model.number="model[field.key]" class="form-control">
  <v-flex :class="flex" class="px-2" v-else-if="inputType === 'number'">
    <v-text-field v-model.number="model[field.key]" :label="label" :type="inputType">
      <v-icon slot="append" v-if="inArray" @click="$emit('remove-field')">delete_outline</v-icon>
    </v-text-field>
  </v-flex>
  <v-flex :class="flex" class="px-2" v-else>
    <v-text-field v-model="model[field.key]" :label="label" :type="inputType">
      <v-icon slot="append" v-if="inArray" @click="$emit('remove-field')">delete_outline</v-icon>
    </v-text-field>
  </v-flex>
</template>
<script>
  //not required but this baseField has a lot of useful stuff already in it, check it out
  import {Fragment} from 'vue-fragment';
  import {upperFirst, get} from 'lodash-es';
  import {VFlex, VSwitch, VSelect, VTextField, VIcon} from 'vuetify/lib';

  const _ = {upperFirst, get};

  export default {
    components: {Fragment, VFlex, VSwitch, VSelect, VTextField, VIcon},
    name: 'GInput',
    props: ['model', 'field', 'inArray', 'noFlex'],
    computed: {
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
        return this.noLayout ? 'xs-12' : this.field.flex;
      }
    },
    mounted() {
      if (this.field.default && typeof this.field.default !== 'function') {
        if (this.inputType.includes('number')) {
          this.model[this.field.key] = parseFloat(this.field.default);
        } else {
          this.model[this.field.key] = this.field.default;
        }
      } else if (this.field.default && typeof this.field.default === 'function') {
        this.model[this.field.key] = this.field.default();
      }
    },
    methods: {
      onChange(e) {
      }
    },
    inject: {
      rootModel: {default: null},
      path: {default: null},
      noLayout: {default: null}
    }
  };
</script>

<style lang="scss">
  @import "~bootstrap/scss/functions";
  @import "~bootstrap/scss/variables";
  @import "~bootstrap/scss/mixins";
  @import "~bootstrap/scss/forms";

  .v-input--switch .v-input__slot {
    margin-bottom: 0 !important;
  }

  .v-input--selection-controls {
    margin-top: 20px !important;
  }

  .v-text-field.v-text-field--solo .v-input__control {

  }

  table tr:not(.g-expansion) {
    .v-select__slot {
      //height: calc(2.25rem + 2px);
      padding-left: 10px;
      border-radius: 4px;
      border: 1px solid #0000002e;
      background-color: white;

      .v-input__icon--clear .v-icon {
        display: none;
        color: #d3d3d3 !important;
      }
    }

    .v-input__slot {
      &:before {
        border: none !important;
      }
    }

    .v-select {
      padding-top: 4px;
    }

    .v-text-field__details {
      display: none;
    }
  }
</style>
