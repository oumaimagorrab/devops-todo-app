import { render, screen } from '@testing-library/react';
import App from './App';

test('renders todo list title', () => {
  render(<App />);
  const title = screen.getByText(/Todo List/i);
  expect(title).toBeInTheDocument();
});