import { generateComponent } from "./common";

describe('GField with type date', function () {
  it('should render correctly', () => {
    const component = generateComponent({ key: 'date', type: 'input@datetime-local', flex: 'md-6' });
    expect(component.html()).toMatchSnapshot();
  });
});
