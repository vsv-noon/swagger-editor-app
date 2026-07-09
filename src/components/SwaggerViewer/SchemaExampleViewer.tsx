import { useState } from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

import styles from './details.module.scss';
import SchemaViewer from './SchemaViewer';
import { JsonValue, OpenApiSchema } from './types';

interface Props {
  schema?: OpenApiSchema;
  example?: JsonValue;
}
export default function SchemaExampleViewer({ schema, example }: Props) {
  const [view, setView] = useState<'example' | 'schema'>(
    example !== undefined ? 'example' : 'schema'
  );

  return (
    <>
      <div className={styles.tabs}>
        <span
          className={`${styles.tab} ${view === 'example' ? styles.active : ''}`}
          onClick={() => setView('example')}
        >
          Example Value
        </span>
        /
        <span
          className={`${styles.tab} ${view === 'schema' ? styles.active : ''}`}
          onClick={() => setView('schema')}
        >
          Schema
        </span>
      </div>
      {view === 'schema' ? (
        schema ? (
          <SchemaViewer schema={schema} />
        ) : (
          <div>No schema</div>
        )
      ) : example !== undefined ? (
        <SyntaxHighlighter language="json" style={vs} className={styles.code}>
          {JSON.stringify(example, null, 2)}
        </SyntaxHighlighter>
      ) : (
        <div>No example</div>
      )}
    </>
  );
}
