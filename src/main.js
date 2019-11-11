import GField from './components/GField2';
import GInput from './components/GInput';
import VueColumnsResizable from 'vue-columns-resizable';

let GForm = {
  install(Vue, options) {
    //Vue.yourMethod = (value) => value
    Vue.use(VueColumnsResizable);
    Vue.component('GField', GField);
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
