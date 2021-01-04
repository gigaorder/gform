import { generateComponent } from "./common";

describe('GField with type input', function () {
  it('should render correctly', () => {
    const component = generateComponent({ key: 'name', type: 'input', flex: 'md-6', default: 'name' });
    expect(component.html()).toMatchSnapshot();
  });
});
