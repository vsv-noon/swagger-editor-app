import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi, describe } from 'vitest';

import { loadMockSchema } from './mockSchema';
import Viewer from './Viewer';

vi.mock('./mockSchema', () => ({
  loadMockSchema: vi.fn(),
}));

vi.mock('./EndpointDetails', () => ({
  default: ({ selected }: { selected: { path: string } }) => (
    <div data-testid="details">{selected.path}</div>
  ),
}));

vi.mock('./ServerSelector', () => ({
  ServerSelector: ({ value }: { value: string }) => (
    <div data-testid="server-selector">{value}</div>
  ),
}));
describe('Viewer tests', () => {
  it('shows loading while schema is loading', () => {
    vi.mocked(loadMockSchema).mockReturnValue(new Promise(() => {}));

    render(<Viewer parsed={{}} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  it('renders endpoint groups', async () => {
    vi.mocked(loadMockSchema).mockResolvedValue({
      servers: [],
      endpoints: [
        {
          method: 'get',
          path: '/users/list',
          parameters: [],
          responses: [],
        },
      ],
    });

    render(<Viewer parsed={{}} />);

    expect(await screen.findByText('users')).toBeInTheDocument();
  });
  it('opens group', async () => {
    const user = userEvent.setup();

    render(<Viewer parsed={{}} />);

    await user.click(await screen.findByText('users'));

    expect(screen.getByText('/users/list')).toBeInTheDocument();
  });
  it('shows endpoint details after selecting endpoint', async () => {
    const user = userEvent.setup();

    render(<Viewer parsed={{}} />);

    await user.click(await screen.findByText('users'));
    await user.click(screen.getByText('/users/list'));

    expect(screen.getByTestId('details')).toHaveTextContent('/users/list');
  });
});
