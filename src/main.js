import GField from './form_converted/GField';
import GInput from './form_converted/GInput';
import GFieldSimpleArray from './form_converted/GFieldSimpleArray';
import GFieldTableArray from './form_converted/GFieldTableArray';
import GFieldChoice from './form_converted/GFieldChoice';
import GFieldChoiceArray from './form_converted/GFieldChoiceArray';
import GFieldObjectArray from './form_converted/GFieldObjectArray';
import GFieldObject from './form_converted/GFieldObject';

let GForm = {
  install(app, options) {
    //Vue.yourMethod = (value) => value
    // app.use(VueColumnsResizable);
    app.component('GField', GField);

    const $gform = {
      rules: [],
      resolveField: function (field) {
        const rules = $gform.rules;
        for (const rule of rules) {
          if (rule.test(field)) {
            return rule.component;
          }
        }
      },
      preprocess: {}
    };

    app.addDynamicFormResolver = function (resolver) {
      $gform.resolver = resolver;
    }
    app.addPreprocess = function (key, process) {
      $gform.preprocess[key] = process;
    }
    app.addField = function (match, component) {
      app.component(component.name, component);
      if (typeof match === 'function') {
        $gform.rules.push({
          test: match,
          component: component.name
        })
      } else {
        $gform.rules.push({
          test: field => field.type.split('@')[0] === match,
          component: component.name
        })
      }
    }

    app.addField(field => field.type.split('@')[0] === 'input', GInput);
    app.addField('choiceArray', GFieldChoiceArray);
    app.addField('choice', GFieldChoice);
    app.addField('object', GFieldObject);
    app.addField('tableArray', GFieldTableArray);
    app.addField(field => field.type === 'array' && field.fields.length === 1, GFieldSimpleArray);
    app.addField(field => field.type === 'array' && field.fields.length > 1, GFieldObjectArray);

    app.provide('$gform', $gform)
  }
};
export default GForm;
export { GForm, GInput, GField }
