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

    Vue.$gform = {mapping: {}}
    Vue.addDynamicFormResolver = function (resolver) {
      Vue.$gform.resolver = resolver;
    }
    Vue.addField = function (name, component) {
      Vue.component(component.name, component);
      Vue.$gform.mapping[name] = component.name;
    }
    Vue.addField('input', GInput);
  }
};
export default GForm;
export {GForm, GInput, GField}
