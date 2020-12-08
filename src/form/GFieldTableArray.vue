<template>
  <g-col xs12>
    <table class="g-datatable g-table theme--light gfield-table"
           v-if="model[field.key] && model[field.key].length > 0">
      <thead>
      <tr class="table-header">
        <th v-if="field.expansion" style="width: 15px"></th>
        <th v-for="_field in mainFields">{{getLabel(_field)}}</th>
        <th>X</th>
      </tr>
      </thead>

      <tbody>
      <template v-for="(val, index) in model[field.key]">
        <tr class="text-md-center">
          <td v-if="field.expansion" style="width: 15px" @click="toggleRowDetail(index)">
            <g-icon>keyboard_arrow_{{rowDetail === index ? 'down': 'right'}}</g-icon>
          </td>
          <td v-for="_field in mainFields" class="input-group-sm">
            <g-field :field="makeTableCell(_field)" :model="model[field.key][index]"
                     :root-model="rootModel" :path="genPath(field.key, index)"/>
          </td>
          <td>
            <g-icon @click="model[field.key].splice(index, 1)">delete</g-icon>
          </td>
        </tr>
        <g-expand-transition>
          <tr v-if="field.expansion && (!field.lazy || rowDetail === index || expansionInitialized[index])"
              v-show="rowDetail === index" class="g-expansion"
              style="border-bottom: 1px solid rgba(0,0,0,0.12);background-color: #f3f3f3;">
            <td :colspan="field.fields.length + 2" style="height: 0 !important;">
              <g-expand-transition>
                <g-card v-show="rowDetail === index" flat
                        style="width: 100%;margin-top: 5px;margin-bottom: 5px;border: solid 1px #d3d3d375;">
                  <g-card-text>
                    <g-field :fields="expansionFields" :model="model[field.key][index]"
                             :root-model="rootModel" :path="genPath(field.key, index)"/>
                  </g-card-text>
                </g-card>
              </g-expand-transition>
            </td>
          </tr>
        </g-expand-transition>
      </template>
      </tbody>

    </table>
    <g-btn class="ma-2" textColor="blue lighten-2" outlined small @click.stop="addObjectItem" v-if="!field.addable">Add
      {{getLabel(field)}}
    </g-btn>
    <slot name="btn-append"></slot>
  </g-col>
</template>

<script>
  import {_modelFactory, flexFactory, genPath, getLabel, labelFactory} from './FormFactory';
  import _ from 'lodash';

  export default {
    name: 'GFieldTableArray',
    props: ['model', 'field', 'rootModel', 'path'],
    data: () => ({
      rowDetail: null,
      expansionInitialized: [],
    }),
    setup(props) {
      const internalModel = _modelFactory(props);
      const flex = flexFactory(props);
      const label = labelFactory(props);

      return {internalModel, flex, label, getLabel}
    },
    computed: {
      mainFields() {
        if (!this.field.expansion) return this.field.fields;
        return this.field.fields.filter(f => !this.field.expansion.includes(f.key));
      },
      expansionFields() {
        if (!this.field.expansion) return [];
        return this.field.fields.filter(f => this.field.expansion.includes(f.key));
      },
    },
    methods: {
      genPath,
      addObjectItem() {
        if (!this.model[this.field.key]) this.model[this.field.key] = []
        this.model[this.field.key].push({});
      },
      //todo: use stateTree
      toggleRowDetail(index) {
        if (this.rowDetail === index) {
          this.rowDetail = null;
        } else {
          this.rowDetail = index;
          this.expansionInitialized[index] = true
        }
      },
      makeTableCell(field) {
        return _.assign(field, {tableCell: true});
      },
    }
  }
</script>

<style lang="scss" scoped>
  table.g-table ::v-deep {
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
