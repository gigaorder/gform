import { getLabel, getValueFromPathFactory } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

function genSimpleArray({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, fieldModel }) {
  return <render-v-nodes>
    {childrenVNodes.map(r => r())}
    <v-flex class="xs12">
      <v-btn color="blue lighten-2" outline small vOn:click={() => {
        if (!fieldModel) vSet(fieldModel, node.key, []);
        fieldModel[node.key].push(null);
      }}>
        Add {getLabel(node)}
      </v-btn>
      <slot name="btn-append">{slots && slots['btn-append']}</slot>
    </v-flex>
  </render-v-nodes>
}

const SimpleArrayHandler = class {

  constructor(context, rootPath) {
    this.context = context;
    this.rootPath = rootPath;
  }

  rule(node) {
    return node.type === 'array' && node.fields.length === 1
  }

  itemChildren(node, { isNodeRootArray, path }, { rootModel, getValue }) {
    const value = getValue();
    const children = _.map(value, (item, index) => {
      return _.assign(_.cloneDeep(node.fields[0]), { key: index, flex: node.flex, label: node.label });
    });
    return children;
  }

  genNode = genSimpleArray

  genDefaultValue() {
    return [];
  }

  itemPath() {
  }
}
export default SimpleArrayHandler;
