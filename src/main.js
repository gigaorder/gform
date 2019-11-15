import GField from './form/GField';
import GInput from './form/GInput';
import VueColumnsResizable from 'vue-columns-resizable';
import GFieldSimpleArray from './form/GFieldSimpleArray';
import { Fragment } from 'vue-fragment';
import ExtendPath from './form/ExtendPath';
import GFieldTableArray from './form/GFieldTableArray';
import GFieldChoice from './form/GFieldChoice';
import GFieldChoiceArray from './form/GFieldChoiceArray';
import GFieldObjectArray from './form/GFieldObjectArray';
import GFieldObject from './form/GFieldObject';

let GForm = {
  install(Vue, options) {
    //Vue.yourMethod = (value) => value
    Vue.use(VueColumnsResizable);
    Vue.component('GField', GField);
    Vue.component('GFieldSimpleArray', GFieldSimpleArray);
    Vue.component('GFieldTableArray', GFieldTableArray);
    Vue.component('GFieldChoice', GFieldChoice);
    Vue.component('GFieldChoiceArray', GFieldChoiceArray);
    Vue.component('GFieldObjectArray', GFieldObjectArray);
    Vue.component('GFieldObject', GFieldObject);
    Vue.component('Fragment', Fragment);
    Vue.component('ExtendPath', ExtendPath);

    Vue.$gform = {
      rules: [],
      resolveField: function (field) {
        const rules = Vue.$gform.rules;
        for (const rule of rules) {
          if (rule.test(field)) {
            return rule.component;
          }
        }
      }
    }

    Vue.addDynamicFormResolver = function (resolver) {
      Vue.$gform.resolver = resolver;
    }
    Vue.addField = function (match, component) {
      Vue.component(component.name, component);
      if (typeof match === 'function') {
        Vue.$gform.rules.push({
          test: match,
          component: component.name
        })
      } else {
        Vue.$gform.rules.push({
          test: field => field.type.split('@')[0] === match,
          component: component.name
        })
      }
    }

    Vue.addField(field => field.type.split('@')[0] === 'input', GInput);
    Vue.addField('choiceArray', GFieldChoiceArray);
    Vue.addField('choice', GFieldChoice);
    Vue.addField('object', GFieldObject);
    Vue.addField('tableArray', GFieldTableArray);
    Vue.addField(field => field.type === 'array' && field.fields.length === 1, GFieldSimpleArray);
    Vue.addField(field => field.type === 'array' && field.fields.length > 1, GFieldObjectArray);
  }
};
export default GForm;
export { GForm, GInput, GField }
