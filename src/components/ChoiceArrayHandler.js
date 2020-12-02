import { _fields, getChoiceName, getLabel, getValueFromPathFactory } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

function genChoiceArray({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, fieldModel }) {
  const choiceKey = node.choiceKey || 'choice'

  function selectChoiceInArray(choice) {
    if (!fieldModel[node.key]) fieldModel[node.key] = []
    fieldModel[node.key].push({ [choiceKey]: getChoiceName(choice) });
  }

  return <render-v-nodes>
    {childrenVNodes && childrenVNodes.map((r, index) => r({
      onRemove: () => fieldModel[node.key].splice(index, 1)
    }))}
    <v-flex class="md12">
      {<v-menu offset-y z-index="1000">
        <v-btn slot="activator" color="primary" small>
          Add {getLabel(node)}
          <v-icon>arrow_drop_down</v-icon>
        </v-btn>
        <v-list>
          {_fields(node).map((choice, index) => <v-list-tile key={index} vOn:click={() => selectChoiceInArray(choice)}>
            <v-list-tile-title>{getChoiceName(choice)}</v-list-tile-title>
          </v-list-tile>)}
        </v-list>
      </v-menu>}
    </v-flex>
  </render-v-nodes>
}

const ChoiceArrayHandler = class {
  constructor(context, rootPath) {
    this.context = context;
    this.rootPath = rootPath;
  }

  rule(node) {
    return node.type === 'choiceArray'
  }

  itemChildren(node, { isNodeRootArray, path }, { rootModel, getValue }) {
    const value = getValue();
    const children = _.map(value, (item, index) => {
      return Object.assign({}, node, { key: index, type: 'choice', inArray: true });
    });
    return children;
  }

  genNode = genChoiceArray

  genDefaultValue(node) {
    if (!node.choiceKeyOutside) return [];
  }

  itemPath() {
  }
}
export default ChoiceArrayHandler;
