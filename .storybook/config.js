import { configure, addParameters } from '@andoshin11/storybook-vue3';
import { createRouter, createWebHistory } from 'vue-router';
import GigaComponents from 'pos-vue-framework';
import GForm from '../src/main';

addParameters({
  options: {
    panelPosition: 'right',
    hierarchySeparator: /\//,
    hierarchyRootSeparator: /\|/,
  },
});

const router = createRouter({
  history: createWebHistory(),
  routes: []
})

global.root.use(router);
global.root.use(GForm);
global.root.use(GigaComponents)

import {
  storiesOf, specs, describe, it,
  after, before, beforeEach, afterEach
} from './facade';

import expect from 'expect';

global.storiesOf = storiesOf;
global.specs = specs;
global.describe = () => {
};
global.it = it;
global.after = after;
global.before = before;
global.beforeEach = beforeEach;
global.afterEach = afterEach;
global.expect = expect;

//for jest
/*import VueTest from 'vue/dist/vue.common.js'
// init plugin first
VueTest.use(VueCompositionApi)*/

configure(require.context('../src', true, /\.stories\.js$/), module);

