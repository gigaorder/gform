<script>
import { genScopeId } from '../utils/vue-utils';
import { withModifiers, computed } from 'vue'
import { Fragment, VFlex, VSwitch, VSelect, VTextField, VIcon } from 'vuetify/lib'
import dayjs from 'dayjs'

export default {
  components: { Fragment, VFlex, VSwitch, VSelect, VTextField, VIcon },
  props: ['model', 'field', 'inArray', 'noFlex', 'rootModel', 'path', 'noLayout'],
  setup(props, { emit }) {
    const paddingClass = computed(() => props.field.tableCell ? 'px-0' : 'px-2')

    const inputType = computed(() => {
      if (props.field.type.includes('@')) {
        return props.field.type.split('@')[1];
      }
      return _.get(props.field, 'inputType', 'text');
    })

    const internalValue = computed({
      get() {
        try {
          if (inputType.value === 'date') {
            return props.model[props.field.key] && dayjs(props.model[props.field.key]).format('YYYY-MM-DD');
          } else if (inputType.value === 'datetime-local') {
            return props.model[props.field.key] && dayjs(props.model[props.field.key]).format('YYYY-MM-DD[T]HH:mm');
          }
        } catch (e) {
        }
        return props.model[props.field.key];
      },
      set(v) {
        if (inputType.value.includes('number')) {
          props.model[props.field.key] = parseFloat(v)
        } else if (inputType.value === 'date') {
          props.model[props.field.key] = new Date(v + 'T00:00:00')
        } else if (inputType.value === 'datetime-local') {
          props.model[props.field.key] = new Date(v)
        } else {
          props.model[props.field.key] = v
        }
      }
    })

    const label = computed(() => {
      if (props.field.label) {
        return props.field.label;
      }
      return _.upperFirst(props.field.key);
    })
    const options = computed(() => {
      if (typeof props.field.options === 'function') {
        return props.field.options(this);
      }
      if (inputType.value.includes('number')) {
        return props.field.options.map(opt => {
          if (typeof opt === 'object') return Object.assign(opt, { value: parseFloat(opt.value) });
          return parseFloat(opt);
        });
      }
      return props.field.options;
    })
    const flex = computed(() => {
      return props.noLayout ? 'xs12' : props.field.flex;
    })


    function clearValue() {
      props.model[props.field.key] = undefined;
    }

    function onChange(e) {
      if (props.field.onChange) {
        props.field.onChange(e, this.rootModel, props.model);
      }
    }

    function removeField() {
      props.model.splice(props.field.key, 1);
    }

    function init()
    {
      if (props.field.default && typeof props.field.default !== 'function' && !props.model[props.field.key]) {
        if (inputType.value.includes('number')) {
          props.model[props.field.key] = parseFloat(props.field.default)
        } else {
          props.model[props.field.key] = props.field.default
        }
      } else if (props.field.default && typeof props.field.default === 'function' && !props.model[props.field.key]) {
        props.model[props.field.key] = props.field.default()
      } else if (!props.model.hasOwnProperty(props.field.key)) {
        props.model[props.field.key] = undefined
      }
    }

    init()

    return genScopeId(() => <>
          {
            (inputType.value === 'switch') &&
            <v-flex class={[flex, paddingClass]}>
              <v-switch color="success" label={props.field.tableCell ? '' : label.value} v-model={internalValue.value}/>
            </v-flex>
          }
          <v-flex class={[flex, paddingClass]}>
            <v-checkbox color="success" label={props.field.tableCell ? '' : label.value} v-model={internalValue.value}/>
          </v-flex>
          <v-flex class={[flex, paddingClass]}>
            <component is={props.field.notOnlyValueInOptions ? 'v-combobox' : 'v-autocomplete'}
                       v-model={internalValue.value}
                       items={options.value}
                       itemText={props.field.itemText}
                       itemValue={props.field.itemValue}
                       chips={props.field.chips}
                       smallChips={props.field.chips}
                       label={props.field.tableCell ? '' : label.value}
                       clearable
                       onChange={onChange}
                       returnObject={!!props.field.returnObject}
                       menuProps={{ 'z-index': 1000, 'closeOnContentClick': true }}>
              {
                (props.inArray) &&
                <v-icon slot="append" onClick={withModifiers(removeField, ['stop'])}>
                  delete_outline
                </v-icon>
              }
            </component>
          </v-flex>
          <v-flex class={[flex, paddingClass]}>
            <v-combobox v-model={internalValue.value}
                        itemText={props.field.itemText}
                        itemValue={props.field.itemValue}
                        items={options.value}
                        hide-selected
                        label={props.field.tableCell ? '' : label.value}
                        multiple
                        small-chips
                        deletable-chips
                        returnObject={!!props.field.returnObject}
                        menuProps={{ 'z-index': 1000, 'closeOnContentClick': true }}>
              {
                (props.inArray) &&
                <v-icon slot="append" onClick={withModifiers(removeField, ['stop'])}>
                  delete_outline
                </v-icon>
              }
            </v-combobox>
          </v-flex>
          <input type={inputType.value} v-model={internalValue.value} class="form-control"/>
          <v-flex class={[flex, paddingClass]}>
            <v-text-field v-model={internalValue.value} label={label.value} type={inputType.value}>
              {
                (props.field.addable) &&
                <v-icon slot="append" style="opacity: 0.4" onClick={withModifiers(clearValue, ['stop'])}>
                  clear
                </v-icon>
              }
              {
                (props.inArray) &&
                <v-icon slot="append" onClick={withModifiers(removeField, ['stop'])}>
                  delete_outline
                </v-icon>
              }
            </v-text-field>
          </v-flex>
        </>
    )
  }
}
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

    .v-input__icon--clear {
      display: none !important;
      color: #d3d3d3 !important;
    }

    input {
      font-size: 1rem;
    }

    .v-input__icon.v-input__icon--append {
      width: 12px !important;
      min-width: 12px;
      padding-right: 9px;
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
