import GField from './components/GField';
import GInput from './components/GInput';

let GForm = {
   install(Vue, options) {
      //Vue.yourMethod = (value) => value
      Vue.component('GField', GField);
      Vue.$gform = {mapping: {}}
      Vue.addField = function (name, component) {
         Vue.component(component.name, component);
         Vue.$gform.mapping[name] = component.name;
      }
      Vue.addField('input', GInput);
   }
};
export default GForm;
export {GForm, GInput, GField}