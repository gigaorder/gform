import { _fields, getChoiceName, getLabel, getValueFromPathFactory } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash-es';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

const getValueFromPath = getValueFromPathFactory(node => {
  if (!node.choiceKeyOutside) return [];
});

function genChoiceArray({ node, text, childrenVNodes, isLast, state, path }, model, pathToParent, slots) {
  const value = getValueFromPath(model, node, pathToParent, path)
  const choiceKey = node.choiceKey || 'choice'

  function selectChoiceInArray(choice) {
    if (!value[node.key]) vSet(value, node.key, []);
    value[node.key].push({ [choiceKey]: getChoiceName(choice) });
  }

  return <render-v-nodes>
    {childrenVNodes && childrenVNodes.map((r, index) => r({
      onRemove: () => value[node.key].splice(index, 1)
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

const ChoiceArrayHandler = {
  rule(node) {
    return node.type === 'choiceArray'
  },
  itemChildren(node, { isNodeRootArray, path }, model) {
    const value = getValueFromPath(model, node, path);
    const children = _.map(value, (item, index) => {
      return Object.assign({}, node, { key: index, type: 'choice', inArray: true });
    });
    return children;
  },
  genNode({ node, text, childrenVNodes, isLast, state, path }, model, pathToParent) {
    return slots => genChoiceArray(...arguments, slots);
  },
  itemPath() {
  }
}
export default ChoiceArrayHandler;
