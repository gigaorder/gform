import { generateComponent } from "./common";

describe('GField with type choice', function () {
  it('should render correctly', () => {
    const component = generateComponent({
      key: 'layout', type: 'choice', choiceKey: 'layoutType',
      fields: [{
        key: 'linear', type: 'object',
        fields: [{ key: 'linearName', type: 'input', flex: 'md-12' }]
      }, {
        key: 'grid', type: 'object',
        fields: [{ key: 'gridName', type: 'input', flex: 'md-12' }]
      }]
    });
    expect(component.html()).toMatchSnapshot();
  });
});
