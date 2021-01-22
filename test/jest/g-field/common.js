import _ from 'lodash';
import GigaComponents from 'pos-vue-framework';
import GForm from '../../../src/main';
import { mount } from "@vue/test-utils";
import GField from '../../../src/form/GField';

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
    global: {
      plugins: [GForm, GigaComponents],
    },
    props: {
      model: _.cloneDeep(modelData),
      field,
    }
  })
}
