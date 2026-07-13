import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import { SchemaField } from './SchemaField';
import { OpenApiSchema } from './types';

vi.mock('./SchemaViewer', () => ({
  default: () => <div data-testid="schema-viewer" />,
}));
it('returns null for invalid schema', () => {
  const { container } = render(
    <SchemaField name="id" schema={null as unknown as OpenApiSchema} />
  );

  expect(container.firstChild).toBeNull();
});
it('renders field name', () => {
  render(<SchemaField name="id" schema={{ type: 'string' }} />);

  expect(screen.getByText('id')).toBeInTheDocument();
});
it('renders format', () => {
  render(
    <SchemaField
      name="id"
      schema={{
        type: 'string',
        format: 'uuid',
      }}
    />
  );

  expect(screen.getByText('(uuid)')).toBeInTheDocument();
});
it('renders SchemaViewer when properties exist', () => {
  render(
    <SchemaField
      name="user"
      schema={{
        type: 'object',
        properties: {
          id: {
            type: 'string',
          },
        },
      }}
    />
  );

  expect(screen.getByTestId('schema-viewer')).toBeInTheDocument();
});
