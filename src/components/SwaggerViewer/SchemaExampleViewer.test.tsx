import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';

import SchemaExampleViewer from './SchemaExampleViewer';

vi.mock('./SchemaViewer', () => ({
  default: () => <div data-testid="schema-viewer">SchemaViewer</div>,
}));
it('shows example by default', () => {
  render(
    <SchemaExampleViewer
      schema={{ type: 'object' }}
      example={{ name: 'John' }}
    />
  );

  expect(screen.getByText(/John/)).toBeInTheDocument();
});
it('shows schema by default when example is absent', () => {
  render(<SchemaExampleViewer schema={{ type: 'object' }} />);

  expect(screen.getByTestId('schema-viewer')).toBeInTheDocument();
});
it('shows "No schema"', async () => {
  const user = userEvent.setup();

  render(<SchemaExampleViewer example={{ name: 'John' }} />);

  await user.click(screen.getByText('Schema'));

  expect(screen.getByText('No schema')).toBeInTheDocument();
});
it('shows "No example"', async () => {
  const user = userEvent.setup();

  render(<SchemaExampleViewer schema={{ type: 'object' }} />);

  await user.click(screen.getByText('Example Value'));

  expect(screen.getByText('No example')).toBeInTheDocument();
});
