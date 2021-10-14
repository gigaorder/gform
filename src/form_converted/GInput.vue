<script>

import {computed, getCurrentInstance, resolveComponent, withModifiers} from 'vue'
import dayjs from 'dayjs'

export default {
  name: 'GInput',
  props: ['model', 'field', 'inArray', 'noFlex', 'rootModel', 'path', 'noLayout'],
  emits: ['remove-field'],
  setup(props, { emit }) {
    const paddingClass = computed(() => {
      return props.field.tableCell ? 'px-0' : 'px-2';
    })
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
        const ctx = getCurrentInstance().ctx;
        return props.field.options(ctx);
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
      return props.noLayout ? 'col-xs-12' : props.field.flex;
    })

    function clearValue() {
      props.model[props.field.key] = undefined;
    }

    function onChange(e) {
      if (props.field.onChange) {
        props.field.onChange(e, props.rootModel, props.model);
      }
    }

    function removeField() {
      //props.model.splice(props.field.key, 1);
      emit('remove-field');
    }

    function init() {
      if (props.field.default && typeof props.field.default !== 'function' && !props.model[props.field.key]) {
        if (inputType.value.includes('number')) {
          props.model, props.field.key, parseFloat(props.field.default);
        } else {
          (props.model, props.field.key, props.field.default);
        }
      } else if (props.field.default && typeof props.field.default === 'function' && !props.model[props.field.key]) {
        (props.model, props.field.key, props.field.default());
      } else if (!props.model.hasOwnProperty(props.field.key)) {
        (props.model, props.field.key, undefined);
      }
    }

    init()
    return () => <>
      {
        (inputType.value === 'switch') ?
            <g-col class={[flex.value, paddingClass.value]}>
              <g-switch label={props.field.tableCell ? '' : label.value} v-model={internalValue.value} v-slots={{
                'label': () =>
                    (props.inArray) &&
                    <>
                      {props.field.tableCell ? '' : label.value}
                      <g-icon onClick={withModifiers(removeField, ['stop'])}>
                        clear
                      </g-icon>
                    </>
              }}>
              </g-switch>
            </g-col>
            :
            (
                (inputType.value === 'checkbox') ?
                    <g-col class="row-flex align-items-center">
                      <g-checkbox color="primary" label={props.field.tableCell ? '' : label.value} v-model={internalValue.value} v-slots={{
                        'label': () =>
                            (props.inArray) && <>
                              {props.field.tableCell ? '' : label.value} (
                              <g-icon onClick={withModifiers(removeField, ['stop'])}>
                                clear
                              </g-icon>)
                            </>
                      }}>
                      </g-checkbox>
                    </g-col>
                    :
                    (
                        (inputType.value === 'select' || inputType.value === 'select:number') ?
                            <g-col class={[flex.value, paddingClass.value]}>
                              {(() => {
                                const dynamicField = resolveComponent(props.field.notOnlyValueInOptions ? 'g-combobox' : 'g-autocomplete');
                                return <dynamicField
                                           v-model={internalValue.value}
                                           normalize={props.field.normalize}
                                           items={options.value}
                                           itemText={props.field.itemText}
                                           itemValue={props.field.itemValue}
                                           chips={props.field.chips}
                                           smallChips={props.field.chips}
                                           label={props.field.tableCell ? '' : label.value}
                                           clearable onChange={onChange}
                                           returnObject={!!props.field.returnObject}
                                           menuProps={{'z-index': 1000, 'closeOnContentClick': true}} v-slots={{
                                  'append-inner': () =>
                                      (props.inArray) &&
                                      <g-icon onClick={withModifiers(removeField, ['stop'])}>
                                        delete_outline
                                      </g-icon>
                                }}>
                                </dynamicField>
                              })()}
                            </g-col>
                            :
                            (
                                (inputType.value === 'multiSelect' || inputType.value === 'multiSelect:number') ?
                                    <g-col class={[flex.value, paddingClass.value]}>
                                      <g-combobox v-model={internalValue.value}
                                                  normalize={props.field.normalize}
                                                  itemText={props.field.itemText}
                                                  itemValue={props.field.itemValue}
                                                  allowduplicates={props.field.allowDuplicates}
                                                  items={options.value} hide-selected
                                                  label={props.field.tableCell ? '' : label.value}
                                                  multiple small-chips
                                                  deletable-chips
                                                  returnObject={!!props.field.returnObject}
                                                  menuProps={{ 'z-index': 1000, 'closeOnContentClick': true }} v-slots={{
                                        'append-inner': () =>
                                            (props.inArray) &&
                                            <g-icon onClick={withModifiers(removeField, ['stop'])}>
                                              delete_outline
                                            </g-icon>
                                      }}/>
                                    </g-col>
                                    :
                                    (
                                        (props.field.tableCell) ?
                                            <input type={inputType.value} v-model={internalValue.value} class="form-control"/>
                                            :
                                            <g-col class={[flex.value, paddingClass.value]}>
                                              <g-text-field v-model={internalValue.value} label={label.value} type={inputType.value} v-slots={{
                                                'append-inner': () => <>
                                                  {
                                                    (props.field.addable) &&
                                                    <g-icon style="opacity: 0.4" onClick={withModifiers(clearValue, ['stop'])}>
                                                      clear
                                                    </g-icon>
                                                  }
                                                  {
                                                    (props.inArray) &&
                                                    <g-icon onClick={withModifiers(removeField, ['stop'])}>
                                                      delete_outline
                                                    </g-icon>
                                                  }
                                                </>
                                              }}/>
                                            </g-col>
                                    )
                            )
                    )
            )
      }
    </>
  }
}
</script>
<style lang="scss">
@import "~bootstrap/scss/functions";
@import "~bootstrap/scss/variables";
@import "~bootstrap/scss/mixins";
@import "~bootstrap/scss/forms";

table.gfield-table tr:not(.g-expansion) {
  .g-combobox, .g-autocomplete, .g-date-picker {
    .g-tf-wrapper {
      min-height: 38px;
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
