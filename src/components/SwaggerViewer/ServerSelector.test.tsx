import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import { ServerSelector } from './ServerSelector';

it('renders all server options', () => {
  render(
    <ServerSelector
      servers={[
        { url: 'http://localhost:3000' },
        { url: 'https://api.test.com' },
      ]}
      value="http://localhost:3000"
      onChange={vi.fn()}
    />
  );

  expect(
    screen.getByRole('option', { name: 'http://localhost:3000' })
  ).toBeInTheDocument();

  expect(
    screen.getByRole('option', { name: 'https://api.test.com' })
  ).toBeInTheDocument();
});
it('calls onChange when selection changes', async () => {
  const user = userEvent.setup();
  const onChange = vi.fn();

  render(
    <ServerSelector
      servers={[
        { url: 'http://localhost:3000' },
        { url: 'https://api.test.com' },
      ]}
      value="http://localhost:3000"
      onChange={onChange}
    />
  );

  await user.selectOptions(
    screen.getByRole('combobox'),
    'https://api.test.com'
  );

  expect(onChange).toHaveBeenCalledWith('https://api.test.com');
});
