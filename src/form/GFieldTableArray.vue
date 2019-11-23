<template>
  <g-col xs12>
    <table class="v-datatable v-table theme--light v-gfield-table"
           v-if="model[field.key] && model[field.key].length > 0">
      <thead>
      <tr>
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
        <GExpandTransition>
          <tr v-if="field.expansion" v-show="rowDetail === index" class="g-expansion"
              style="border-bottom: 1px solid rgba(0,0,0,0.12);background-color: #f3f3f3;">
            <td :colspan="field.fields.length + 2" style="height: 0 !important;">
              <GExpandTransition>
                <g-card v-show="rowDetail === index" flat
                        style="width: 100%;margin-top: 5px;margin-bottom: 5px;border: solid 1px #d3d3d375;">
                  <g-card-text>
                    <g-field :fields="expansionFields" :model="model[field.key][index]"
                             :root-model="rootModel" :path="genPath(field.key, index)"/>
                  </g-card-text>
                </g-card>
              </GExpandTransition>
            </td>
          </tr>
        </GExpandTransition>
      </template>

      </tbody>

    </table>
    <g-btn textColor="blue lighten-2" outlined small @click="addObjectItem()" v-if="!field.addable">Add
      {{getLabel(field)}}
    </g-btn>
    <slot name="btn-append"></slot>
  </g-col>
</template>

<script>
  import {_modelFactory, addObjectItem, flexFactory, genPath, getLabel, labelFactory} from './FormFactory';
  import _ from 'lodash';

  export default {
    name: 'GFieldTableArray',
    props: ['model', 'field', 'rootModel', 'path'],
    data: () => ({
      rowDetail: null
    }),
    setup(props, context) {
      const _model = _modelFactory(props);
      const flex = flexFactory(props)
      const label = labelFactory(props);

      return {_model, flex, label, getLabel}
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
      addObjectItem: addObjectItem,
      //todo: use stateTree
      toggleRowDetail(index) {
        if (this.rowDetail === index) {
          this.rowDetail = null;
        } else {
          this.rowDetail = index;
        }
      },
      makeTableCell(field) {
        return _.assign(field, {tableCell: true});
      },
    }
  }
</script>

<style lang="scss" scoped>
  table.v-table tbody td:not(:nth-child(1)) {
    padding: 0 10px;
  }

  .v-datatable.v-table thead tr {
    height: 40px;
  }

  .v-datatable.v-table tbody td {
    height: 44px;
    padding: 0 10px !important;

    .v-text-field .v-input__append-inner {
      padding-left: 0 !important;
    }
  }

  .v-datatable.v-table th {
    padding: 0 18px;
  }

  .theme--light.v-table {
    //background-color: transparent;
  }

  .fix-inline {
    padding-right: 7px;
    padding-left: 7px;

    .remove-btn {
      right: 7px;
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
