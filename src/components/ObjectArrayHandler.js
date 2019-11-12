import { getLabel, getValueFromPathFactory } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash-es';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

function genObjectArray({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, model }) {
  return <render-v-nodes>
    <v-layout row wrap>
      {childrenVNodes.map(r => r())}
    </v-layout>
    {!node['addable'] && <v-btn color="blue lighten-2" outline small vOn:click={() => {
      if (!model) vSet(model, node.key, ref([]));
      model[node.key].push({});
    }}>
      Add {getLabel(node)}
    </v-btn>}
  </render-v-nodes>
}

const ObjectArrayHandler = {
  rule(node) {
    return ['array'].includes(node.type) && node.fields.length > 1;
  },
  itemChildren(node, { isNodeRootArray, path }, { rootModel, getValue }) {
    const value = getValue();
    const children = _.map(value, (item, index) => Object.assign({}, node, { key: index, type: 'object' }));
    return children;
  },
  genNode: genObjectArray,
  genDefaultValue() {
    return [];
  },
  itemPath() {
  }
}
export default ObjectArrayHandler;
