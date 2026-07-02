import SwaggerParser from '@apidevtools/swagger-parser';
import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';

import { parseCode } from './parse';

export const openApiLinterSource = async (
  view: EditorView
): Promise<Diagnostic[]> => {
  const code = view.state.doc.toString();
  if (!code.trim()) return [];

  const diagnostics: Diagnostic[] = [];

  const parsed = parseCode(code);

  if (!parsed) {
    return [
      {
        from: 0,
        to: Math.min(10, code.length),
        severity: 'error',
        message: 'Invalid JSON/YAML',
      },
    ];
  }

  try {
    await SwaggerParser.validate(parsed.data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    diagnostics.push({
      from: 0,
      to: 1,
      severity: 'error',
      message,
    });
  }

  return diagnostics;
};
