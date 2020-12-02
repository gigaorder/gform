import {computed} from 'vue';

export const _modelFactory = (props) => computed(() => {
  if (typeof props.field.key !== 'undefined') return props.model[props.field.key];
  return props.model;
});

export const flexFactory = (props) => computed(() => {
  return props.noLayout ? 'xs-12' : props.field.flex;
});

export const _rootModelFactory = (props) => computed(() => {
  return props.rootModel || props.model;
});

export const labelFactory = (props) => computed(() => {
  if (props.field.label) {
    return props.field.label;
  }
  if (props.field.key) {
    return _.upperFirst(props.field.key);
  }
  return _.upperFirst(props.model.choice);
});

export function getLabel(field) {
  if (field.label) {
    return field.label;
  }
  return _.upperFirst(field.key);
}

export const _fieldsFactory = (props) => computed(() => {
  if (typeof props.field.dynamicFields === 'function') {
    try {
      return props.field.dynamicFields(props);
    } catch (e) {
      return [];
    }
  } else if (props.field.dynamicFields && Vue.$gform.resolver) {
    const resolver = Vue.$gform.resolver;
    const fields = [];
    if (props.field.fields) fields.push(...props.field.fields);
    fields.push(...resolver(props.field.dynamicFields));
    return fields;
  }
  return props.field.fields;
});

export function addObjectItem() {
  if (!this.model[this.field.key]) this.$set(this.model, this.field.key, []);
  this.model[this.field.key].push({});
}

export function getChoiceName(choice) {
  return choice.choiceName || choice.key;
}

export function genPath() {
  const rootPathArr = this.path ? [this.path] : [];
  const result = rootPathArr.concat(...arguments).filter(path => path !== undefined).join('.');
  return result
}
