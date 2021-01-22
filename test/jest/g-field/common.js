import _ from 'lodash';
import GigaComponents from 'pos-vue-framework';
import GForm from '../../../src/main';
import { mount, config } from "@vue/test-utils";
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

beforeAll(() => {
  config.renderStubDefaultSlot = true
})

export function generateComponent(field) {
  return mount(GField, {
    global: {
      plugins: [GForm],
      stubs: {
        'g-row': true,
        'g-col': true,
        'g-tab': true,
        'g-avatar': true,
        'g-autocomplete': true,
        'g-badge': true,
        'g-btn': true,
        "g-btn-bs": true,
        'g-card': true,
        'g-card-title': true,
        'g-combobox': true,
        'g-dialog': true,
        'g-divider': true,
        "g-icon": true,
        'g-item-group': true,
        'g-menu': true,
        "g-overlay": true,
        'g-radio': true,
        'g-simple-table': true,
        'g-spacer': true,
        'g-switch': true,
        'g-table': true,
        'g-tabs': true,
        'g-tab-item': true,
        'g-text-field': true,
        'g-text-field-bs': true,
        'g-toolbar': true,
        'g-snackbar': true,
        'g-chip': true,
        'g-checkbox': true,
        'g-list-item-text': true,
        'g-list-item-content': true,
        'g-list-item': true,
        'g-list': true,

      },
    },
    props: {
      model: _.cloneDeep(modelData),
      field,
    }
  })
}
