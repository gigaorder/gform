import { getLabel, getValueFromPathFactory, makeAddable } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash-es';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

const getValueFromPath = getValueFromPathFactory(node => {
  if (node.key) return {};
});


function genObjectWithoutPanel({ node, text, childrenVNodes, isLast, state, path }, model, pathToParent) {
  const value = getValueFromPath(model, node, pathToParent, path)
  return makeAddable(node.fields, childrenVNodes, value);
}

function genObjectWithPanel({ node, text, childrenVNodes, isLast, state, path }, model, pathToParent, slots) {
  const value = getValueFromPath(model, node, pathToParent, path)
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
    if (Array.isArray(value)) {
      return value.splice(node.key, 1);
    }
    value[node.key] = undefined
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
          {makeAddable(node.fields, childrenVNodes, value)}
        </v-layout>
      </v-expand-transition>
    </fieldset>
  </v-flex>
}

const ObjectHandler = {
  rule(node) {
    return node.type === 'object'
  },
  itemChildren(node, { isNodeRootArray, path }, model) {
    getValueFromPath(model, node, path);
    return node.fields;
  },
  genNode({ node, text, childrenVNodes, isLast, state, path }, model, pathToParent) {
    if (!node.noPanel) return slots => genObjectWithPanel(...arguments, slots);
    if (node.noPanel) return slots => genObjectWithoutPanel(...arguments, slots);
  },
  itemPath(node, { key, path, isRoot }) {
    if (_.isNil(node.key)) return null;
  }
}
export default ObjectHandler;
