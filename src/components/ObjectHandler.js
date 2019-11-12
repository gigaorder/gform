import { getLabel, getValueFromPathFactory, makeAddable } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash-es';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

function genObjectWithoutPanel({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, model }) {
  return makeAddable(node.fields, childrenVNodes, model);
}

function genObjectWithPanel({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, model }) {
  /*const _fields = function () {
    if (typeof node.dynamicFields === 'function') {
      try {
        return node.dynamicFields(this);
      } catch (e) {
        return [];
      }
    } else if (node.dynamicFields && Vue.$gform.resolver) {
      const resolver = Vue.$gform.resolver;
      const fields = [];
      if (node.fields) fields.push(...node.fields);
      fields.push(...resolver(node.dynamicFields));
      return fields;
    }
    return node.fields;
  }()*/
  //todo: dynamicFields
  const label = getLabel(node);

  function onRemove() {
    if (Array.isArray(model)) {
      return model.splice(node.key, 1);
    }
    model[node.key] = undefined
  }

  return <v-flex xs12>
    <fieldset vShow={node.fields && node.fields.length > 0} style="position: relative">
      <v-btn small depressed class="remove-btn" vOn:click={slots && slots.onRemove ? slots.onRemove : onRemove}>
        <v-icon>delete</v-icon>
      </v-btn>

      <slot name="action">{slots && slots.action}</slot>
      {label && <legend>
        <span vOn:click={() => state.collapse = !state.collapse}>
          {label} {state.collapse ? '+' : ''}
        </span>
      </legend>}

      <v-expand-transition>
        <v-layout row wrap style="padding-top: 5px;" v-show={!state.collapse}>
          {makeAddable(node.fields, childrenVNodes, model)}
        </v-layout>
      </v-expand-transition>
    </fieldset>
  </v-flex>
}

const ObjectHandler = {
  rule(node) {
    return node.type === 'object'
  },
  itemChildren(node, { isNodeRootArray, path }, { rootModel, getValue }) {
    getValue();
    return node.fields;
  },
  genNode({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, model }) {
    if (!node.noPanel) return genObjectWithPanel(...arguments);
    if (node.noPanel) return genObjectWithoutPanel(...arguments);
  },
  genDefaultValue(node) {
    if (node.key) return {};
  },
  itemPath(node, { key, path, isRoot }) {
    if (_.isNil(node.key)) return null;
  }
}
export default ObjectHandler;
