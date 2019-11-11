import { genField, getLabel, getValueFromPathFactory } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash-es';
import Vue from 'vue';
import { reactive, set as vSet, ref } from '@vue/composition-api';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

function genTableArray({ node, text, childrenVNodes, isLast, state, path }, value, slots) {
  const mainFields = function () {
    if (!node.expansion) return node.fields;
    return node.fields.filter(f => !node.expansion.includes(f.key));
  }()

  const expansionFields = function () {
    if (!node.expansion) return [];
    return node.fields.filter(f => node.expansion.includes(f.key));
  }();

  function toggleRowDetail(index) {
    if (!state.hasOwnProperty('rowDetail')) vSet(state, 'rowDetail', ref(null));
    if (state.rowDetail === index) {
      state.rowDetail = null;
    } else {
      state.rowDetail = index;
    }
  }

  function addObjectItem() {
    if (!value[node.key]) {
      vSet(value, node.key, ref([]));
    }
    value[node.key].push({});
  }

  function renderTableField(field, val) {
    return genField({ node: _.assign({}, field, { tableCell: true },), path: [node.key] }, val)
  }

  return <v-flex xs12>
    {!_.isEmpty(value[node.key]) && <table className="v-datatable v-table theme--light v-gfield-table">
      <thead>
      <tr>
        {node.expansion && <th style="width: 15px"></th>}
        {mainFields.map(f => <th>{getLabel(f)}</th>)}
        <th>X</th>
      </tr>
      </thead>

      <tbody>
      {value[node.key].map((val, index) => (
        <render-v-nodes>
          <tr className="text-md-center" key={index}>
            {node.expansion &&
            <td style="width: 15px" vOn:click={toggleRowDetail}>
              <v-icon>keyboard_arrow_{state.rowDetail === index ? 'down' : 'right'}</v-icon>
            </td>}
            {mainFields.map((_field, _index) => <td className="input-group-sm" key={_index}>
              {renderTableField(_field, val)}
            </td>)}
            <td>
              <v-icon vOn:click={() => value[node.key].splice(index, 1)}>delete</v-icon>
            </td>
          </tr>

          <v-expand-transition key={index}>
            {node.expansion && <tr v-show={state.rowDetail === index} className="g-expansion"
                                   style="border-bottom: 1px solid rgba(0,0,0,0.12);background-color: #f3f3f3;">
              <td colSpan={node.fields.length + 2} style="height: 0 !important;">
                <v-expand-transition>
                  <v-card v-show={state.rowDetail === index} flat
                          style="width: 100%;margin-top: 5px;margin-bottom: 5px;border: solid 1px #d3d3d375;">
                    <v-card-text>
                      <g-field fields={expansionFields} value={value[node.key][index]}></g-field>
                    </v-card-text>
                  </v-card>
                </v-expand-transition>
              </td>
            </tr>}
          </v-expand-transition>
        </render-v-nodes>
      ))}
      </tbody>

    </table>}
    {!node['addable'] &&
    <v-btn color="blue lighten-2" outline small vOn:click={() => addObjectItem()}>Add {getLabel(node)}
    </v-btn>}
    <slot name="btn-append">{slots && slots['btn-append']}</slot>
  </v-flex>
}

const TableArrayHandler = {
  rule(node) {
    return node.type === 'tableArray'
  },
  itemChildren(node, { isNodeRootArray, path }, getValueFromModel) {
    return [];
  },
  genNode({ node, text, childrenVNodes, isLast, state, path }, value) {
    return slots => genTableArray(...arguments, slots);
  },
  itemPath() {
  }
}
export default TableArrayHandler;
