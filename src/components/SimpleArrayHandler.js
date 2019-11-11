import { getLabel, getValueFromPathFactory } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash-es';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

const getValueFromPath = getValueFromPathFactory(() => []);

function genSimpleArray({ node, text, childrenVNodes, isLast, state, path }, model, pathToParent, slots) {
  const value = getValueFromPath(model, node, pathToParent, path)
  return <render-v-nodes>
    {childrenVNodes.map(r => r())}
    <v-flex class="xs12">
      <v-btn color="blue lighten-2" outline small vOn:click={() => {
        if (!value) vSet(value, node.key, ref([]));
        value[node.key].push(null);
      }}>
        Add {getLabel(node)}
      </v-btn>
      <slot name="btn-append">{slots && slots['btn-append']}</slot>
    </v-flex>
  </render-v-nodes>
}

const SimpleArrayHandler = {
  rule(node) {
    return node.type === 'array' && node.fields.length === 1
  },
  itemChildren(node, { isNodeRootArray, path }, model) {
    const value = getValueFromPath(model, node, path);
    const children = _.map(value, (item, index) => {
      return _.assign(_.cloneDeep(node.fields[0]), { key: index, flex: node.flex, label: node.label });
    });
    return children;
  },
  genNode({ node, text, childrenVNodes, isLast, state, path }, model, pathToParent) {
    return slots => genSimpleArray(...arguments, slots);
  },
  itemPath() {
  }
}
export default SimpleArrayHandler;
