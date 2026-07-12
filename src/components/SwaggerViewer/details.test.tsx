import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { executeRequest } from '@/lib/executeRequest';

import Details from './EndpointDetails';
import { Endpoint } from './types';

vi.mock('@/lib/executeRequest', () => ({
  executeRequest: vi.fn(),
}));

vi.mock('./SchemaExampleViewer', () => ({
  default: () => <div data-testid="schema-viewer" />,
}));

describe('Viewer tests', () => {
  it('Select endpoint test', () => {
    render(<Details selected={null} server="" />);

    expect(screen.getByText('Select endpoint')).toBeInTheDocument();
  });
  it('No parametrs', () => {
    const endpoint: Endpoint = {
      path: '/users',
      method: 'get',
      parameters: [],
      responses: [],
    };

    render(<Details selected={endpoint} server="" />);
    expect(screen.getByText('No parameters')).toBeInTheDocument();
  });
  it(' parametrs', () => {
    const endpoint: Endpoint = {
      path: '/users',
      method: 'get',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      responses: [],
    };

    render(<Details selected={endpoint} server="" />);

    expect(screen.getAllByText(/id/)).toHaveLength(2);
    expect(screen.getByText(/\(required\)/)).toBeInTheDocument();
  });
  it('cURL generation', async () => {
    const endpoint: Endpoint = {
      path: '/users',
      method: 'post',
      parameters: [],
      responses: [],
      requestBody: {
        contentType: 'application/json',
        example: { name: 'John' },
      },
    };
    const user = userEvent.setup();

    render(<Details selected={endpoint} server="" />);
    await user.click(screen.getByText('Generate cURL'));
    expect(screen.getByText('Copy')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
  });

  it('Try it Out', async () => {
    vi.mock('@/lib/executeRequest', () => ({
      executeRequest: vi.fn(),
    }));
    vi.mocked(executeRequest).mockResolvedValue({
      json: async () => ({
        status: 200,
        headers: {},
        body: {},
      }),
    } as Response);
    const endpoint: Endpoint = {
      path: '/users',
      method: 'post',
      parameters: [],
      responses: [],
      requestBody: {
        contentType: 'application/json',
        example: { name: 'John' },
      },
    };
    const user = userEvent.setup();

    render(<Details selected={endpoint} server="" />);
    await user.click(screen.getByText('Try it Out'));
    expect(executeRequest).toHaveBeenCalled();
  });
  it('Copy', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: async () => {},
      },
    });

    const endpoint: Endpoint = {
      path: '/users',
      method: 'post',
      parameters: [],
      responses: [],
      requestBody: {
        contentType: 'application/json',
        example: { name: 'John' },
      },
    };
    const user = userEvent.setup();

    render(<Details selected={endpoint} server="" />);

    const writeTextSpy = vi.spyOn(navigator.clipboard, 'writeText');

    await user.click(screen.getByText('Generate cURL'));
    await user.click(await screen.findByRole('button', { name: 'Copy' }));

    expect(writeTextSpy).toHaveBeenCalled();
  });
  it(' responses', () => {
    const endpoint: Endpoint = {
      path: '/users',
      method: 'get',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      responses: [
        {
          statusCode: '200',
          description: 'OK',
        },
      ],
    };

    render(<Details selected={endpoint} server="" />);

    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('OK')).toBeInTheDocument();
  });
  it(' parameters', async () => {
    const endpoint: Endpoint = {
      path: '/users/{id}',
      method: 'get',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
        {
          name: 'page',
          in: 'query',
          required: false,
        },
      ],
      responses: [],
    };
    const user = userEvent.setup();

    render(<Details selected={endpoint} server="" />);
    await user.type(screen.getByLabelText('id'), '15');
    await user.type(screen.getByLabelText('page'), '2');

    await user.click(screen.getByText('Try it Out'));
    expect(executeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        pathParams: {
          id: '15',
        },
        queryParams: {
          page: '2',
        },
      })
    );
  });
  it('contentType', async () => {
    const endpoint: Endpoint = {
      path: '/upload',
      method: 'post',
      parameters: [],
      responses: [],
      requestBody: {
        contentType: 'application/octet-stream',
      },
    };
    const user = userEvent.setup();

    render(<Details selected={endpoint} server="" />);

    await user.click(screen.getByText('Try it Out'));
    expect(executeRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        headers: expect.objectContaining({
          'Content-Type': 'application/octet-stream',
        }),
      })
    );
  });
  it('replacing the path parameter', async () => {
    const endpoint: Endpoint = {
      path: '/users/{id}',
      method: 'get',
      parameters: [
        {
          name: 'id',
          in: 'path',
          required: true,
        },
      ],
      responses: [],
    };
    const user = userEvent.setup();

    render(<Details selected={endpoint} server="" />);

    const input = screen.getByRole('textbox');
    await user.type(input, '15');

    await user.click(screen.getByText('Generate cURL'));
    expect(screen.getByText(/\/users\/15/)).toBeInTheDocument();
  });
  it('replacing the query parameter', async () => {
    const endpoint: Endpoint = {
      path: '/users',
      method: 'get',
      parameters: [
        {
          name: 'page',
          in: 'query',
          required: false,
        },
      ],
      responses: [],
    };
    const user = userEvent.setup();

    render(<Details selected={endpoint} server="" />);

    await user.type(screen.getByRole('textbox'), '2');

    await user.click(screen.getByText('Generate cURL'));

    await user.click(screen.getByText('Generate cURL'));
    expect(screen.getByText(/\?page=2/)).toBeInTheDocument();
  });
  it('application/octet-stream', async () => {
    const endpoint: Endpoint = {
      path: '/upload',
      method: 'post',
      parameters: [],
      responses: [],
      requestBody: {
        contentType: 'application/octet-stream',
      },
    };
    const user = userEvent.setup();

    render(<Details selected={endpoint} server="" />);
    const file = new File(['hello'], 'test.txt');
    const input = screen.getByTestId('file-input');

    await user.upload(input, file);
    await user.click(screen.getByText('Generate cURL'));
    // expect(screen.getByText(/application\/octet-stream/)).toBeInTheDocument();
    expect(screen.getByText(/test\.txt/)).toBeInTheDocument();
  });
  it('updates request body', async () => {
    const user = userEvent.setup();

    const endpoint: Endpoint = {
      path: '/users',
      method: 'post',
      parameters: [],
      responses: [],
      requestBody: {
        contentType: 'application/json',
        example: { name: 'John' },
      },
    };

    render(<Details selected={endpoint} server="" />);

    const textarea = screen.getByRole('textbox');

    await user.clear(textarea);
    fireEvent.change(textarea, {
      target: {
        value: '{"name":"Kate"}',
      },
    });
    expect(textarea).toHaveValue('{"name":"Kate"}');
  });
});
