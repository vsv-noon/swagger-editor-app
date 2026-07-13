import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import SchemaViewer from './SchemaViewer';

vi.mock('./SchemaField', () => ({
  SchemaField: ({ name }: { name: string }) => (
    <div data-testid="schema-field">{name}</div>
  ),
}));
it('returns null when schema has no properties', () => {
  const { container } = render(<SchemaViewer schema={{ type: 'object' }} />);

  expect(container.firstChild).toBeNull();
});
it('renders all schema fields', () => {
  render(
    <SchemaViewer
      schema={{
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      }}
    />
  );

  expect(screen.getAllByTestId('schema-field')).toHaveLength(2);
  expect(screen.getByText('id')).toBeInTheDocument();
  expect(screen.getByText('name')).toBeInTheDocument();
});
