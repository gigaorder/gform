/* eslint-disable import/no-extraneous-dependencies */
import { configure } from '@storybook/vue'

import FormStory from '../../src/stories/FormStory';
import Vue from "vue";
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '../../src/plugins/vuetify'

Vue.component('form-story', FormStory);

const req = require.context('../../src/stories', true, /.stories.js$/)

function loadStories() {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
