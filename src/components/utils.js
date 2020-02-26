import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash';
import { reactive, set as vSet, ref } from '@vue/composition-api';

const _ = { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty };
import Vue from 'vue';

export function getLabel(node) {
  return node.label || _.upperFirst(node.key);
  //return _.upperFirst(this.model.choice);
}

export function _fields(node) {
  if (typeof node.dynamicFields === 'function') {
    try {
      //fixme: vm
      return node.dynamicFields();
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
}

export function getChoiceName(choice) {
  return choice.choiceName || choice.key;
}

export function makeAddable(fields, childrenVNodes, value, context) {
  function getAddFields(fields, value) {
    return fields.filter(field => {
      if (!field['addable']) return false;
      if (typeof value[field.key] === 'undefined') return true;
      if (field.type.includes('array') || field.type.includes('Array')) {
        return true;
      }
      return false;
    })
  }

  function getFormFields(fields, value) {
    return fields.filter(field => {
      if (!field['addable']) return true;
      if (typeof value[field.key] === 'undefined') return false;
      return true;
    })
  }

  function isVisible(field, context) {
    if (!field.isVisible) return true;
    return field.isVisible(context);
  }

  function addNullValue(field) {
    if (field.type.includes('array') || field.type.includes('Array')) {
      if (!value[field.key]) vSet(value, field.key, []);
      value[field.key].push({});
    } else if (field.type && field.type.split('@')[0] === 'object') {
      vSet(value, field.key, {});
    } else {
      vSet(value, field.key, null)
      //value[field.key] = null;
    }
  }

  const formFields = getFormFields(fields, value).map(field => fields.indexOf(field));

  return <render-v-nodes>
    {childrenVNodes.filter((child, index) => formFields.includes(index)).map(r => r())}
    <v-flex xs12>
      {getAddFields(fields, value).map((addField, index) =>
        <v-chip key={addField.key + index} v-show={isVisible(addField, context)}
                color="#4dd8a7" text-color="white" vOn:click={() => addNullValue(addField)}>
          <v-avatar>
            <v-icon>add_circle</v-icon>
          </v-avatar>
          {addField.label || addField.key}
        </v-chip>
      )}
    </v-flex>
  </render-v-nodes>
}

function getParentAndKey(model, path = []) {
  const parentPath = [...path];
  const key = parentPath.pop();
  if (parentPath.length === 0) {
    return [model, key];
  }
  return [_.get(model, parentPath.join('.')), key];
}

export function getValueFromPathFactory(genDefaultValue) {
  return function getValueFromModel(model, node, path, pathToField) {
    /*if (pathToField && !_.get(model, pathToField.join('.')) && node.default) {
      if (typeof node.default === 'function') {
        vSet(model, pathToField.join('.'), ref(node.default()));
      } else {
        vSet(model, pathToField.join('.'), ref(node.default));
      }
    }*/

    if (path.length === 0) {
      return model;
    } else {
      if (_.get(model, path.join('.'))) return _.get(model, path.join('.'));
      //todo : test default case, addable
      let _defaultValue;
      if (node.default) {
        _defaultValue = node.default
      } else if (genDefaultValue) {
        _defaultValue = genDefaultValue(node);
      }

      if (node.addable) _defaultValue = undefined;
      // get parent

      vSet(...getParentAndKey(model, path), _defaultValue);
      return _.get(model, path.join('.'));
    }
  }
}

export function genField({ node, text, childrenVNodes, isLast, state, path = [] }, { rootModel, fieldModel, slots }, fieldProps) {
  if (!node.type) return;
  const Comp = Vue.$gform.mapping[node.type.split('@')[0]] || node.type;
  let inArray = Array.isArray(fieldModel)
  return <Comp field={node} {...{ props: { model: fieldModel, rootModel } }} inArray={inArray} path={path.join('.')} {...{ props: fieldProps }}/>
  //return h(field, { props: { field: node, value, inArray }/*, attrs: { node }*/ })
}

export function getFields(node) {
  if (typeof node.dynamicFields === 'function') {
    try {
      return node.dynamicFields(this.context);
    } catch (e) {
      return [];
    }
  } else if (node.dynamicFields && Vue['$gform'].resolver) {
    const resolver = Vue['$gform'].resolver;
    const fields = [];
    if (node.fields) fields.push(...node.fields);
    fields.push(...resolver(node.dynamicFields));
    return fields;
  }
  return node.fields;
}
