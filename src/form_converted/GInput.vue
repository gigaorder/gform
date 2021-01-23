<script>
export default {
  setup() {
    return () => <>
      {
        (inputType === 'switch') ?
            <g-col class={[flex, paddingClass]}>
              <g-switch label={field.tableCell ? '' : label} v-model={internalValue} v-slots={{
                'label': () => <> {
                  (inArray) &&
                  <>
                    {field.tableCell ? '' : label} (
                    <g-icon slot="append-inner" onClick={withModifiers(removeField, ['stop'])}>
                      clear
                    </g-icon>
                    )
                  </>
                }
                </>
              }}>
              </g-switch>
            </g-col>
            :
            (
                (inputType === 'checkbox') ?
                    <g-col class="row-flex align-items-center">
                      <g-checkbox color="primary" label={field.tableCell ? '' : label} v-model={internalValue} v-slots={{
                        'label': () => <> {
                          (inArray) &&
                          <>
                            {field.tableCell ? '' : label} (
                            <g-icon slot="append-inner" onClick={withModifiers(removeField, ['stop'])}>
                              clear
                            </g-icon>
                            )
                          </>
                        }
                        </>
                      }}>
                      </g-checkbox>
                    </g-col>
                    :
                    (
                        (inputType === 'select' || inputType === 'select:number') ?
                            <g-col class={[flex, paddingClass]}>
                              <component is={field.notOnlyValueInOptions ? 'g-combobox' : 'g-autocomplete'} v-model={internalValue} normalize={field.normalize} items={options} itemText={field.itemText} itemValue={field.itemValue} chips={field.chips} smallChips={field.chips} label={field.tableCell ? '' : label} clearable onChange={onChange} returnObject={!!field.returnObject} menuProps={{ 'z-index': 1000, 'closeOnContentClick': true }} v-slots={{
                                'append-inner': () => <> {
                                  (inArray) &&
                                  <>
                                    <g-icon onClick={withModifiers(removeField, ['stop'])}>
                                      delete_outline
                                    </g-icon>
                                  </>
                                }
                                </>
                              }}>
                              </component>
                            </g-col>
                            :
                            (
                                (inputType === 'multiSelect' || inputType === 'multiSelect:number') ?
                                    <g-col class={[flex, paddingClass]}>
                                      <g-combobox v-model={internalValue} normalize={field.normalize} itemText={field.itemText} itemValue={field.itemValue} allowduplicates={field.allowDuplicates} items={options} hide-selected label={field.tableCell ? '' : label} multiple small-chips deletable-chips returnObject={!!field.returnObject} menuProps={{ 'z-index': 1000, 'closeOnContentClick': true }} v-slots={{
                                        'append-inner': () => <> {
                                          (inArray) &&
                                          <>
                                            <g-icon onClick={withModifiers(removeField, ['stop'])}>
                                              delete_outline
                                            </g-icon>
                                          </>
                                        }
                                        </>
                                      }}>
                                      </g-combobox>
                                    </g-col>
                                    :
                                    (
                                        (field.tableCell) ?
                                            <input type={inputType} v-model={internalValue} class="form-control"> </input>
                                            :
                                            <g-col class={[flex, paddingClass]}>
                                              <g-text-field v-model={internalValue} label={label} type={inputType} v-slots={{
                                                'append-inner': () => <> {
                                                  (field.addable) &&
                                                  <>
                                                    <g-icon style="opacity: 0.4" onClick={withModifiers(() => clearValue(), ['stop'])}>
                                                      clear
                                                    </g-icon>
                                                  </>
                                                }
                                                  {
                                                    (inArray) &&
                                                    <>
                                                      <g-icon onClick={withModifiers(removeField, ['stop'])}>
                                                        delete_outline
                                                      </g-icon>
                                                    </>
                                                  }
                                                </>
                                                ,
                                              }}>
                                              </g-text-field>
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
