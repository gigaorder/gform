import { generateComponent } from "./common";

describe('GField with type array', function () {
  it('should render correctly', () => {
    const component = generateComponent({
      key: 'addressArray1', type: 'array', label: 'Address1', flex: 'md-3',
      fields: [{ key: 'street', type: 'input', flex: 'md-6' }, { key: 'city', type: 'input', flex: 'md-6' },]
    });
    expect(component.html()).toMatchSnapshot();
  });
});
