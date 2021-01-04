import { generateComponent } from "./common";

describe('GField with type number input', function () {
  it('should render correctly', () => {
    const component = generateComponent({ key: 'nr', type: 'input@number', flex: 'md-6', addable: true });
    expect(component.html()).toMatchSnapshot();
  });
});

