'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import Loader from '@/components/Loader';
import { OPEN_API_EDITOR_INITIAL_VALUE } from '@/constants/constants';
import { parseCode } from '@/lib/parse';

const SwaggerEditor = dynamic(() => import('@/components/SwaggerEditor'), {
  ssr: false,
  loading: () => <Loader variant="fullscreen" />,
});

export default function SwaggerPage() {
  const [code, setCode] = useState(OPEN_API_EDITOR_INITIAL_VALUE);

  const parsed = parseCode(code);

  return (
    <div>
      <h2>Smart OpenAPI Editor (Auto-detected: YAML / JSON)</h2>
      <p style={{ color: '#666' }}>
        Try erasing the text and writing <code>{'{}'}</code> — The editor will
        instantly switch to the JSON schema, highlight syntax errors.
      </p>

      <SwaggerEditor value={code} onChange={setCode} />
    </div>
  );
}
