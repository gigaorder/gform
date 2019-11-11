import { getLabel, getValueFromPathFactory } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash-es';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

const getValueFromPath = getValueFromPathFactory(node => []);

function genObjectArray({ node, text, childrenVNodes, isLast, state, path }, model, pathToParent) {
  const value = getValueFromPath(model, node, pathToParent, path);
  return <render-v-nodes>
    <v-layout row wrap>
      {childrenVNodes.map(r => r())}
    </v-layout>
    {!node['addable'] && <v-btn color="blue lighten-2" outline small vOn:click={() => {
      if (!value) vSet(value, node.key, ref([]));
      value[node.key].push({});
    }}>
      Add {getLabel(node)}
    </v-btn>}
  </render-v-nodes>
}

const ObjectArrayHandler = {
  rule(node) {
    return ['array'].includes(node.type) && node.fields.length > 1;
  },
  itemChildren(node, { isNodeRootArray, path }, model) {
    const value = getValueFromPath(model, node, path);
    const children = _.map(value, (item, index) => Object.assign({}, node, { key: index, type: 'object' }));
    return children;
  },
  genNode({ node, text, childrenVNodes, isLast, state, path }, model, pathToParent) {
    return slots => genObjectArray(...arguments, slots);
  },
  itemPath() {
  }
}
export default ObjectArrayHandler;
