import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';

import SwaggerEditor from './SwaggerEditor';

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

let mockUser: unknown = { id: 1 };
vi.mock('@/lib/supabase/useUser', () => ({
  useUser: () => mockUser,
}));

const convertFormat = vi.fn();
vi.mock('@/lib/convert', () => ({
  convertFormat: (...args: unknown[]) => convertFormat(...args),
}));

const detectFormat = vi.fn();
vi.mock('@/lib/parse', () => ({
  detectFormat: (...args: unknown[]) => detectFormat(...args),
  parseCode: () => ({ format: 'yaml' }),
}));

const openApiLinterSource = vi.fn();
vi.mock('./openApiLinterSource', () => ({
  openApiLinterSource: (...args: unknown[]) => openApiLinterSource(...args),
}));

vi.mock('@codemirror/state', () => ({
  EditorState: {
    create: ({ doc }: { doc: string }) => ({
      doc: {
        toString: () => doc,
        length: doc.length,
      },
      selection: {
        main: { from: 0 },
      },
    }),
  },
  Compartment: class {
    of() {
      return {};
    }
    reconfigure() {
      return {};
    }
  },
}));

vi.mock('@codemirror/view', () => {
  class MockEditorView {
    state: unknown;
    dispatch = vi.fn();
    destroy = vi.fn();

    constructor({ state }: { state: unknown }) {
      this.state = state;
    }
  }

  return {
    EditorView: Object.assign(MockEditorView, {
      updateListener: {
        of: vi.fn((fn) => fn),
      },
    }),
    keymap: { of: () => ({}) },
    lineNumbers: () => ({}),
    highlightActiveLine: () => ({}),
  };
});

vi.mock('@codemirror/commands', () => ({
  defaultKeymap: [],
  history: () => ({}),
  historyKeymap: [],
}));

vi.mock('@codemirror/lang-json', () => ({
  json: () => ({}),
}));

vi.mock('@codemirror/lang-yaml', () => ({
  yaml: () => ({}),
}));

vi.mock('@codemirror/lint', () => ({
  linter: () => ({}),
  lintGutter: () => ({}),
}));

global.fetch = vi.fn();
global.alert = vi.fn();

describe('SwaggerEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = { id: 1 };
    detectFormat.mockReturnValue('yaml');
    convertFormat.mockReturnValue('{"ok":true}');
    openApiLinterSource.mockResolvedValue([]);
  });

  it('renders UI', () => {
    render(<SwaggerEditor value="test" onChange={vi.fn()} />);

    expect(screen.getByText('title')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /convertButton/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /saveButton/i })
    ).toBeInTheDocument();
  });

  it('save disabled when no user', () => {
    mockUser = null;

    render(<SwaggerEditor value="test" onChange={vi.fn()} />);

    expect(screen.getByRole('button', { name: /saveButton/i })).toBeDisabled();
  });

  it('handleSave success', async () => {
    (fetch as Mock).mockResolvedValueOnce({ ok: true });

    render(<SwaggerEditor value="{}" onChange={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /saveButton/i }));

    expect(fetch).toHaveBeenCalledWith(
      '/api/save',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ code: '{}' }),
      })
    );

    expect(alert).toHaveBeenCalledWith('Saved successfully ✅');
  });

  it('handleSave error', async () => {
    (fetch as Mock).mockRejectedValueOnce(new Error('fail'));

    render(<SwaggerEditor value="{}" onChange={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: /saveButton/i }));

    expect(alert).toHaveBeenCalledWith('fail');
  });

  it('convert yaml → json', async () => {
    detectFormat.mockReturnValue('yaml');
    convertFormat.mockReturnValue('{"a":1}');

    render(<SwaggerEditor value="a: 1" onChange={vi.fn()} />);

    await userEvent.click(
      screen.getByRole('button', { name: /convertButton/i })
    );

    expect(convertFormat).toHaveBeenCalledWith('a: 1', 'json');
  });

  it('convert does nothing if null', async () => {
    convertFormat.mockReturnValue(null);

    render(<SwaggerEditor value="bad" onChange={vi.fn()} />);

    await userEvent.click(
      screen.getByRole('button', { name: /convertButton/i })
    );

    expect(convertFormat).toHaveBeenCalled();
  });

  it('initial format detection called', () => {
    render(<SwaggerEditor value="{}" onChange={vi.fn()} />);

    expect(detectFormat).toHaveBeenCalled();
  });
});
