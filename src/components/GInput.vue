<template>
  <v-flex :class="flex" class="px-2" v-if="inputType === 'switch'">
    <v-switch color="success" :label="field.tableCell ? '': label" v-model="value"/>
  </v-flex>
  <v-flex :class="flex" class="px-2" v-else-if="inputType === 'checkbox'">
    <v-checkbox color="success" :label="field.tableCell ? '': label" v-model="value"/>
  </v-flex>
  <v-flex :class="flex" class="px-2" v-else-if="inputType === 'select' || inputType === 'select:number'">
    <v-autocomplete v-model="value" :items="options" :label="field.tableCell ? '': label" clearable
                    @change="onChange"
                    :return-object="!!field.returnObject"
                    :menu-props="{'z-index': 1000, 'closeOnContentClick': true}">
      <v-icon slot="append" v-if="inArray" @click.stop="$emit('remove-field')">delete_outline</v-icon>
    </v-autocomplete>
  </v-flex>
  <v-flex :class="flex" class="px-2" v-else-if="inputType === 'multiSelect' || inputType === 'multiSelect:number'">
    <v-combobox
      v-model="value"
      :item-text="field.itemText" :item-value="field.itemValue"
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
  <input v-else-if="field.tableCell" :type="inputType" v-model="value"
         class="form-control">
  <v-flex :class="flex" class="px-2" v-else>
    <v-text-field v-model="value" :label="label" :type="inputType">
      <v-icon slot="append" v-if="inArray" @click.stop="$emit('remove-field')">delete_outline</v-icon>
    </v-text-field>
  </v-flex>
</template>
<script>
  //not required but this baseField has a lot of useful stuff already in it, check it out
  import { Fragment } from 'vue-fragment';
  import { upperFirst, get } from 'lodash-es';
  import { VFlex, VSwitch, VSelect, VTextField, VIcon } from 'vuetify/lib';

  const _ = { upperFirst, get };

  function parseTimeLocale(date) {
    if (!date) return null
    return parseDateLocale(date) + 'T' + date.toLocaleString(undefined, {
      hour: '2-digit',
      hour12: false,
      minute: '2-digit',
      second: '2-digit'
    })
  }

  function parseDateLocale(date) {
    if (!date) return null
    const [month, day, year] = date.toLocaleDateString().split('/')
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
  }

  export default {
    components: { Fragment, VFlex, VSwitch, VSelect, VTextField, VIcon },
    name: 'GInput',
    props: ['model', 'field', 'inArray', 'noFlex'],
    computed: {
      value: {
        get() {
          try {
            if (this.inputType === 'date') {
              return parseDateLocale(this.model[this.field.key]);
            } else if (this.inputType === 'datetime-local') {
              return parseTimeLocale(this.model[this.field.key])
            }
          } catch (e) {
          }
          return this.model[this.field.key];
        },
        set(v) {
          if (this.inputType.includes('number')) {
            this.$set(this.model, this.field.key, parseFloat(v))
          } else if (this.inputType.includes('date')) {
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
            if (typeof opt === 'object') return Object.assign(opt, { value: parseFloat(opt.value) });
            return parseFloat(opt);
          });
        }
        return this.field.options;
      },
      flex() {
        return this.noLayout ? 'xs12' : this.field.flex;
      }
    },
    mounted() {
      if (this.field.default && typeof this.field.default !== 'function' && !this.model[this.field.key]) {
        if (this.inputType.includes('number')) {
          this.model[this.field.key] = parseFloat(this.field.default);
        } else {
          this.model[this.field.key] = this.field.default;
        }
      } else if (this.field.default && typeof this.field.default === 'function' && !this.model[this.field.key]) {
        this.model[this.field.key] = this.field.default();
      }
    },
    methods: {
      onChange(e) {
      }
    },
    inject: {
      rootModel: { default: null },
      path: { default: null },
      noLayout: { default: null }
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

  .v-select__slot {
    .v-input__icon--clear .v-icon {
      color: #d3d3d3 !important;
    }
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
