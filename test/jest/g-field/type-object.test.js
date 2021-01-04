import { generateComponent } from "./common";

describe('GField with type object', function () {
  it('should render correctly', () => {
    const component = generateComponent({
      key: 'address', type: 'object',
      fields: [{ key: 'street', type: 'input', flex: 'md-6' }, { key: 'city', type: 'input', flex: 'md-6' },]
    });
    expect(component.html()).toMatchSnapshot();
  });
});
