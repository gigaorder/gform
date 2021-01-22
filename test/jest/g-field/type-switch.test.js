import { generateComponent } from "./common";

describe('GField with type switch', function () {
  it('should render correctly', () => {
    const component = generateComponent({ key: 'switch', type: 'input', inputType: 'switch', flex: 'md-6' });
    expect(component.html()).toMatchSnapshot();
  });
});
