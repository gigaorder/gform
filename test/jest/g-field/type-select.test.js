import { generateComponent } from "./common";

describe('GField with type select', function () {
  it('should render correctly', () => {
    const component = generateComponent({
      key: 'sex', type: 'input', inputType: 'select', flex: 'md-6', itemText: 'text', itemValue: 'value', sex: '',
      options: [{ text: 'male', value: 0 }, { text: 'female', value: 1 }]
    });
    expect(component.html()).toMatchSnapshot();
  });
});
