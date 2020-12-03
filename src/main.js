import GField from './form/GField';
import GInput from './form/GInput';
import GFieldSimpleArray from './form/GFieldSimpleArray';
import GFieldTableArray from './form/GFieldTableArray';
import GFieldChoice from './form/GFieldChoice';
import GFieldChoiceArray from './form/GFieldChoiceArray';
import GFieldObjectArray from './form/GFieldObjectArray';
import GFieldObject from './form/GFieldObject';

let GForm = {
  install(app, options) {
    //Vue.yourMethod = (value) => value
    // app.use(VueColumnsResizable);
    app.component('GField', GField);
    app.component('GFieldSimpleArray', GFieldSimpleArray);
    app.component('GFieldTableArray', GFieldTableArray);
    app.component('GFieldChoice', GFieldChoice);
    app.component('GFieldChoiceArray', GFieldChoiceArray);
    app.component('GFieldObjectArray', GFieldObjectArray);
    app.component('GFieldObject', GFieldObject);

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
