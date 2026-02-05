import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders add item button', () => {
  const { getByText } = render(<App />);
  const buttonElement = getByText(/Add Item/i);
  expect(buttonElement).toBeInTheDocument();
});
