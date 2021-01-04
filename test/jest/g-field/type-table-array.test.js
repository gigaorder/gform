import { generateComponent } from "./common";

describe('GField with type table array', function () {
  it('should render correctly', () => {
    const component = generateComponent({
      key: 'addressArray3', type: 'tableArray', label: 'Address3',
      fields: [{ key: 'street', type: 'input', flex: 'md-6' }, { key: 'city', type: 'input', flex: 'md-6' },]
    });
    expect(component.html()).toMatchSnapshot();
  });
});
