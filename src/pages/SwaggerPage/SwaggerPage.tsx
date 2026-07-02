'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import Loader from '@/components/Loader';
import { parseCode } from '@/components/SwaggerEditor/parse';

const SwaggerEditor = dynamic(() => import('@/components/SwaggerEditor'), {
  ssr: false,
  loading: () => <Loader variant="fullscreen" />,
});

export default function SwaggerPage() {
  const [code, setCode] = useState(
    `openapi: 3.0.0
info:
  title: My API
  version: 1.0.0
paths:
  /paths:
    post:
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: ""
      responses:
        "201":
          description: ""
          content:
            application/json:
              schema:
                $ref: ""
components:
  schemas:
    User:
      "type": "object"`
  );

  const parsed = parseCode(code);

  console.log(parsed);

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
