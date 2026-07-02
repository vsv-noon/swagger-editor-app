import { useEffect, useRef } from 'react';

import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import { linter, lintGutter } from '@codemirror/lint';
import { Compartment, EditorState } from '@codemirror/state';
import {
  EditorView,
  highlightActiveLine,
  keymap,
  lineNumbers,
} from '@codemirror/view';

import { openApiLinterSource } from './openApiLinterSource';
import { parseCode } from './parse';
import styles from './SwaggerEditor.module.scss';

interface SwaggerEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const languageCompartment = new Compartment();

function getLanguage(code: string) {
  const parsed = parseCode(code);
  return parsed?.format === 'json' ? json() : yaml();
}

export default function SwaggerEditor({ value, onChange }: SwaggerEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const startState = EditorState.create({
      doc: value,
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        lintGutter(),
        languageCompartment.of(getLanguage(value)),
        linter(openApiLinterSource, { delay: 750 }),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        yaml(),

        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onChange(newValue);

            viewRef.current?.dispatch({
              effects: languageCompartment.reconfigure(getLanguage(newValue)),
            });
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: containerRef.current,
    });

    viewRef.current = view;

    return () => view.destroy();
  }, []);

  return (
    <div
      className={styles.swaggerEditor}
      style={{ height: '100%' }}
      ref={containerRef}
    />
  );
}
