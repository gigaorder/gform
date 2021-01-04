import { generateComponent } from "./common";

describe('GField with type choice array', function () {
  it('should render correctly', () => {
    const component = generateComponent({
      key: 'layout2', type: 'choiceArray', label: 'Layout', choiceKey: 'type',
      fields: [{
        choiceName: 'linear', type: 'object',
        fields: [{key: 'linearName', type: 'input', flex: 'md-12'}]
      }, {
        choiceName: 'grid', type: 'object',
        fields: [{key: 'gridName', type: 'input', flex: 'md-12'}]
      }]
    });
    expect(component.html().replace(/fragment=".*?"/g, '')).toMatchSnapshot();
  });
});
