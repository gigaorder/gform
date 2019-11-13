import { getLabel, getValueFromPathFactory } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash-es';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

function genObjectArray({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, fieldModel }) {
  const flex = this.context.noLayout ? 'xs12' : node.flex;
  return <v-flex xs12>
    <v-layout row wrap>
      {childrenVNodes.map((r, index) => <v-flex class={[flex, flex !== 'xs12' ? 'fix-inline' : '']} key={index}
                                                style="position: relative;">
        {r()}
      </v-flex>)}
    </v-layout>
    {!node['addable'] && <v-btn color="blue lighten-2" outline small vOn:click={() => {
      if (!fieldModel) vSet(fieldModel, node.key, []);
      fieldModel[node.key].push({});
    }}>
      Add {getLabel(node)}
    </v-btn>}
  </v-flex>
}

const ObjectArrayHandler = class {
  constructor(context, rootPath) {
    this.context = context;
    this.rootPath = rootPath;
  }

  rule(node) {
    return ['array'].includes(node.type) && node.fields.length > 1;
  }

  itemChildren(node, { isNodeRootArray, path }, { rootModel, getValue }) {
    const value = getValue();
    const children = _.map(value, (item, index) => Object.assign({}, node,
      { key: index, label: getLabel(node), type: 'object' }));
    return children;
  }

  genNode = genObjectArray

  genDefaultValue() {
    return [];
  }

  itemPath() {
  }
}
export default ObjectArrayHandler;
