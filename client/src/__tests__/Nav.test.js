import React from 'react';
import {shallow} from 'enzyme';
import Nav from '../comps/Lays/Nav';

test('NAV TEST', () => {
  // Render a checkbox with label in the document
  const checkbox = shallow(<Nav>ururu</Nav>);

  expect(checkbox.text()).toEqual('ururu');
});
