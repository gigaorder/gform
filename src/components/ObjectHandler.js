import { getLabel, getValueFromPathFactory, makeAddable, getFields } from './utils';
import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };

function genObjectWithoutPanel({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, fieldModel }) {
  const _fields = getFields.bind(this)(node);
  return makeAddable(_fields, childrenVNodes, fieldModel);
}

function genObjectWithPanel({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, fieldModel }) {
  const _fields = getFields.bind(this)(node);
  //todo: dynamicFields
  const label = getLabel(node);

  function onRemove() {
    if (Array.isArray(fieldModel)) {
      return fieldModel.splice(node.key, 1);
    }
    fieldModel[node.key] = undefined
  }

  return <v-flex xs12>
    <fieldset vShow={_fields && node.fields.length > 0} style="position: relative">
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
          {makeAddable(node.fields, childrenVNodes, fieldModel, this.context)}
        </v-layout>
      </v-expand-transition>
    </fieldset>
  </v-flex>
}

const ObjectHandler = class {
  constructor(context, rootPath) {
    this.context = context;
    this.rootPath = rootPath;
  }

  rule(node) {
    return !!(node.type && node.type.split('@')[0] === 'object');
  }

  itemChildren(node, { isNodeRootArray, path }, { rootModel, getValue }) {
    getValue();
    const _fields = getFields.bind(this)(node);
    return _fields;
  }

  genNode({ node, text, childrenVNodes, isLast, state, path }, { rootModel, pathToParent, treeStates, slots, fieldModel }) {
    if (!node.noPanel) return genObjectWithPanel.bind(this)(...arguments);
    if (node.noPanel) return genObjectWithoutPanel.bind(this)(...arguments);
  }

  genDefaultValue(node) {
    if (node.key) return {};
  }

  itemPath(node, { key, path, isRoot }) {
    if (_.isNil(node.key)) return null;
  }
}
export default ObjectHandler;
