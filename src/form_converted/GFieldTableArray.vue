<script>

import {computed, ref, withModifiers} from 'vue'
import {genPath, getLabel} from './FormFactory';
import {genScopeId} from "../utils/vue-utils";

export default {
  name: 'GFieldTableArray',
  props: ['model', 'field', 'rootModel', 'path'],
  setup(props, {emit}) {
    const rowDetail = ref(null)
    const expansionInitialized = ref([])
    const mainFields = computed(() => {
      if (!props.field.expansion) return props.field.fields;
      return props.field.fields.filter(f => !props.field.expansion.includes(f.key));
    })
    const expansionFields = computed(() => {
      if (!props.field.expansion) return [];
      return props.field.fields.filter(f => props.field.expansion.includes(f.key));
    })

    function addObjectItem() {
      if (!props.model[props.field.key]) props.model[props.field.key] = []
      props.model[props.field.key].push({});
    }

    //todo: use stateTree
    function toggleRowDetail(index) {
      if (rowDetail.value === index) {
        rowDetail.value = null;
      } else {
        rowDetail.value = index;
        expansionInitialized.value[index] = true
      }
    }

    function makeTableCell(field) {
      return _.assign(field, {tableCell: true});
    }

    const _render = genScopeId(() =>
        <div class="col-flex col-xs-12">
          {
            (props.model[props.field.key] && props.model[props.field.key].length > 0) &&
            <table class="g-datatable g-table theme--light gfield-table">
              <thead>
              <tr class="table-header">
                {
                  (props.field.expansion) &&
                  <th style="width: 15px"/>
                }
                {mainFields.value.map(_field =>
                    <th>
                      {getLabel(_field)}
                    </th>
                )}
                <th>
                  X
                </th>
              </tr>
              </thead>
              <tbody>
              {props.model[props.field.key].map((val, index) =>
                  <>
                    <tr class="text-md-center">
                      {
                        (props.field.expansion) &&
                        <td style="width: 15px" onClick={() => toggleRowDetail(index)}>
                          <g-icon>
                            {rowDetail.value === index ? 'keyboard_arrow_down' : 'keyboard_arrow_right'} </g-icon>
                        </td>
                      }
                      {mainFields.value.map(_field =>
                          <td class="input-group-sm">
                            <g-field field={makeTableCell(_field)}
                                     model={props.model[props.field.key][index]}
                                     rootModel={props.rootModel}
                                     path={genPath(props, props.field.key, index)}
                            />
                          </td>
                      )}
                      <td>
                        <g-icon onClick={() => props.model[props.field.key].splice(index, 1)}>
                          delete
                        </g-icon>
                      </td>
                    </tr>
                    <g-expand-transition>
                      {
                        (props.field.expansion && (!props.field.lazy || rowDetail.value === index || expansionInitialized.value[index])) &&
                        <tr v-show={rowDetail.value === index} class="g-expansion"
                            style="border-bottom: 1px solid rgba(0,0,0,0.12);background-color: #f3f3f3;">
                          <td colspan={props.field.fields.length + 2} style="height: 0 !important;">
                            <g-expand-transition>
                              <g-card v-show={rowDetail.value === index} flat
                                      style="width: 100%;margin-top: 5px;margin-bottom: 5px;border: solid 1px #d3d3d375;">
                                <g-card-text>
                                  <g-field fields={expansionFields.value}
                                           model={props.model[props.field.key][index]}
                                           rootModel={props.rootModel}
                                           path={genPath(props, props.field.key, index)}
                                  />
                                </g-card-text>
                              </g-card>
                            </g-expand-transition>
                          </td>
                        </tr>
                      }
                    </g-expand-transition>
                  </>
              )}
              </tbody>
            </table>
          }
          {
            (!props.field.addable) &&
            <g-btn class="ma-2" textcolor="blue lighten-2" outlined small
                   onClick={withModifiers(addObjectItem, ['stop'])}>
              Add
              {getLabel(props.field)}
            </g-btn>
          }
          <slot name="btn-append"></slot>
        </div>)

    return {_render, rowDetail}
  },
  render() {
    return this._render();
  }
}
</script>

<style lang="scss" scoped>
table.g-table :deep {
  .g-tf-wrapper {
    margin: 8px 0;
  }
}

table.g-table {
  border-collapse: collapse;

  tbody td:not(:nth-child(1)) {
    padding: 0 10px;
  }

  thead tr:first-child, tbody tr:not(:last-child) {
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  .form-control {
    border: 1px solid #ced4da;
  }
}

.g-datatable.g-table thead tr {
  height: 40px !important;
}

.g-datatable.g-table tbody td {
  height: 44px !important;
  padding: 0 10px !important;

  .v-text-field .v-input__append-inner {
    padding-left: 0 !important;
  }
}

.g-datatable.g-table th {
  padding: 0 18px;
}

.theme--light.g-table {
  //background-color: transparent;
}

.fix-inline {
  padding-right: 7px;
  padding-left: 7px;

  .remove-btn {
    right: 7px;
  }
}

table {
  &.g-table {
    border-radius: 2px;
    border-collapse: collapse;
    border-spacing: 0;
    width: 100%;
    max-width: 100%;
  }

  &.theme--light.g-table {
    background-color: #fff;
    color: rgba(0, 0, 0, 0.87);
  }

  .table-header {
    color: rgba(0, 0, 0, 0.54);
    font-size: 0.75rem;
  }
}
</style>

<style lang="scss">
.tab-wrapper {
  .v-tabs__bar {
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .v-window {
    height: calc(100% - 50px)
  }

  &, .v-window__container, .v-window-item {
    height: 100%
  }
}
</style>
