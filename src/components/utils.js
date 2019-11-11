import { upperFirst, filter, values, assign, cloneDeep, map, get, set, isNil, isEmpty } from 'lodash-es';
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

export function makeAddable(fields, childrenVNodes, value) {
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

  function isVisible(field) {
    if (!field.isVisible) return true;
    return field.isVisible();
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
        <v-chip key={addField.key + index} v-show={isVisible(addField)}
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

export function getValueFromPathFactory(genDefaultValue) {
  return function getValueFromModel(model, node, path, pathToField) {
    if (pathToField && !_.get(model, pathToField.join('.')) && node.default) {
      vSet(model, pathToField.join('.'), ref(node.default));
    }

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

      vSet(model, path.join('.'), ref(_defaultValue));
      return _.get(model, path.join('.'));
    }
  }
}

export function genField({ node, text, childrenVNodes, isLast, state, path }, value) {
  const Comp = Vue.$gform.mapping[node.type.split('@')[0]] || node.type;
  let inArray = Array.isArray(value)
  return <Comp field={node} value={value} {...{ props: { model: value } }} inArray={inArray} path={path.join('.')}/>
  //return h(field, { props: { field: node, value, inArray }/*, attrs: { node }*/ })
}
