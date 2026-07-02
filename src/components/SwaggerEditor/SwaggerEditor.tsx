import { useEffect, useRef, useState } from 'react';

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

import { OPEN_API_EDITOR_INITIAL_VALUE } from '@/constants/constants';
import { convertFormat } from '@/lib/convert';
import { detectFormat, parseCode } from '@/lib/parse';

import { openApiLinterSource } from './openApiLinterSource';
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

  const [liveFormat, setLiveFormat] = useState<'yaml' | 'json'>('yaml');

  useEffect(() => {
    if (!containerRef.current) return;

    const startFormat = detectFormat(OPEN_API_EDITOR_INITIAL_VALUE);
    setLiveFormat(startFormat);

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
            const format = detectFormat(newValue);
            setLiveFormat(format);
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

  const setLanguage = (format: 'json' | 'yaml') => {
    const view = viewRef.current;
    if (!view) return;

    view.dispatch({
      effects: languageCompartment.reconfigure(
        format === 'json' ? json() : yaml()
      ),
    });
  };

  const handleConvert = () => {
    const view = viewRef.current;
    if (!view) return;
    const code = view.state.doc.toString();

    const nextFormat = liveFormat === 'yaml' ? 'json' : 'yaml';

    const converted = convertFormat(code, nextFormat);

    if (!converted) return;

    const { from } = view.state.selection.main;

    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.length,
        insert: converted,
      },
      selection: {
        anchor: Math.min(from, converted.length),
      },
    });

    setLanguage(nextFormat);
    setLiveFormat(nextFormat);
  };

  return (
    <div className={styles.swaggerEditorContainer}>
      <div className={styles.buttonsBlock}>
        <button className={styles.button} onClick={handleConvert}>
          Convert to {liveFormat === 'yaml' ? 'JSON' : 'YAML'}{' '}
        </button>
        <button className={styles.button}>Save</button>
      </div>
      <div
        className={styles.swaggerEditor}
        style={{ height: '100%' }}
        ref={containerRef}
      />
    </div>
  );
}
