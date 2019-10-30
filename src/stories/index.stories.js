import FormStory from './FormStory';

export default {
  title: 'Form',
};

export const test1 = () => ({
  components: { FormStory },
  props: {
  },
  template: `<form-story></form-story>`,
})
