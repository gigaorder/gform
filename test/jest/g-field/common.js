import Vue from 'vue';
import _ from 'lodash';
import '../../../src/plugins/giga-components.js';
import CompositionApi from '@vue/composition-api'
import GForm from "../../../src/main";
import { mount } from "@vue/test-utils";
import GField from "../../../src/form/GField";

Vue.use(CompositionApi)
Vue.use(GForm);
window._ = _;

const modelData = {
  name: 'test',
  addressArray3: [
    { street: 'a1', city: 'b1' },
    { street: 'a2', city: 'b2' }
  ],
  type: 'linear',
  linearName: 'test',
};

export function generateComponent(field) {
  return mount(GField, {
    propsData: {
      model: _.cloneDeep(modelData),
      field,
    }
  })
}
