'use client';

import { useEffect, useState } from 'react';

import { loadMockSchema } from './mockSchema';
import SchemaViewer from './SchemaViewer';

import type { Endpoint } from './types';

export default function Viewer() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selected, setSelected] = useState<Endpoint | null>(null);

  const [params, setParams] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');
  const [response, setResponse] = useState<{
    status: number;
    headers: Record<string, string>;
    body: unknown;
  } | null>(null);

  useEffect(() => {
    loadMockSchema().then(setEndpoints);
  }, []);

  function resetForSelected(endpoint: Endpoint) {
    setParams({});
    setHeaders({});
    setBody(
      endpoint.requestBody?.example
        ? JSON.stringify(endpoint.requestBody.example, null, 2)
        : ''
    );
    setResponse(null);
  }

  useEffect(() => {
    if (!selected) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetForSelected(selected);
  }, [selected]);

  if (!endpoints.length) {
    return <div>Loading...</div>;
  }

  async function execute() {
    if (!selected) return;

    let url = 'http://localhost:8080/api/v3' + selected.path;
    for (const p of selected.parameters.filter((p) => p.in === 'path')) {
      url = url.replace(
        `{${p.name}}`,
        encodeURIComponent(params[p.name] ?? '')
      );
    }
    const search = new URLSearchParams();

    for (const p of selected.parameters.filter((p) => p.in === 'query')) {
      const value = params[p.name];

      if (value) {
        search.append(p.name, value);
      }
    }

    if (search.toString()) {
      url += '?' + search.toString();
    }
    const res = await fetch(url, {
      method: selected.method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body:
        selected.requestBody && selected.method !== 'get' ? body : undefined,
    });
    const text = await res.text();

    let parsed: unknown = text;

    try {
      parsed = JSON.parse(text);
    } catch {
      // если ответ не JSON, оставляем строку
    }

    setResponse({
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      body: parsed,
    });
  }
  return (
    <div style={{ display: 'flex', gap: 40 }}>
      <div>
        <h3>Endpoints</h3>

        {endpoints.map((e, i) => (
          <div
            key={i}
            onClick={() => setSelected(e)}
            style={{ cursor: 'pointer', marginBottom: 8 }}
          >
            <b>{e.method.toUpperCase()}</b> {e.path}
          </div>
        ))}
      </div>

      <div>
        <h3>Details</h3>

        {!selected ? (
          <div>Select endpoint</div>
        ) : (
          <>
            <div>
              <b>{selected.method.toUpperCase()}</b> {selected.path}
            </div>

            <h4>Parameters</h4>

            {selected.parameters.length === 0 ? (
              <div>No parameters</div>
            ) : (
              selected.parameters.map((p, i) => (
                <div key={i}>
                  {p.name} — {p.in} {p.required ? '(required)' : ''}
                </div>
              ))
            )}

            <h4>Request Body</h4>

            {selected.requestBody ? (
              <>
                <div>
                  <b>Content type:</b> {selected.requestBody.contentType}
                </div>

                {selected.requestBody?.schema && (
                  <>
                    <h5>Schema</h5>
                    <SchemaViewer schema={selected.requestBody.schema} />
                  </>
                )}

                <h5>Example</h5>

                <pre>
                  {JSON.stringify(selected.requestBody.example, null, 2)}
                </pre>
              </>
            ) : (
              <div>No request body</div>
            )}

            <button onClick={execute}>Execute</button>
            {selected.parameters.map((p) => (
              <div key={p.name}>
                <label>{p.name}</label>

                <input
                  value={params[p.name] ?? ''}
                  onChange={(e) =>
                    setParams({
                      ...params,
                      [p.name]: e.target.value,
                    })
                  }
                />
              </div>
            ))}
            {selected.requestBody && (
              <textarea
                rows={15}
                cols={60}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            )}
            <h4>Responses</h4>
            {response && (
              <>
                <h4>Result</h4>

                <div>
                  <b>Status:</b> {response.status}
                </div>

                <h5>Headers</h5>

                <pre>{JSON.stringify(response.headers, null, 2)}</pre>

                <h5>Body</h5>

                <pre>{JSON.stringify(response.body, null, 2)}</pre>
              </>
            )}

            {selected.responses.map((response) => (
              <div key={response.statusCode}>
                <h5>{response.statusCode}</h5>

                <div>{response.description}</div>

                {response.contentType && (
                  <div>
                    <b>Content type:</b> {response.contentType}
                  </div>
                )}

                {response.schema !== undefined && (
                  <>
                    <div>Schema</div>
                    <SchemaViewer schema={response.schema} />
                  </>
                )}

                {response.example !== undefined && (
                  <>
                    <div>Example</div>

                    <pre>{JSON.stringify(response.example, null, 2)}</pre>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
