import { useContext, useEffect, useState } from 'react';

import SchemaViewer from './SchemaViewer';
import { Endpoint } from './types';

interface Props {
  selected: Endpoint | null;
}
export default function Details({ selected }: Props) {
  const [params, setParams] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [curl, setCurl] = useState('');

  const contentType = selected?.requestBody?.contentType;
  const isBinary = contentType === 'application/octet-stream';
  const [response, setResponse] = useState<{
    status: number;
    headers: Record<string, string>;
    body: unknown;
  } | null>(null);
  function resetForSelected(endpoint: Endpoint) {
    setParams({});
    setHeaders({});
    setBody(
      endpoint.requestBody?.example
        ? JSON.stringify(endpoint.requestBody.example, null, 2)
        : ''
    );
    setResponse(null);
    setCurl('');
  }

  useEffect(() => {
    if (!selected) return;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    resetForSelected(selected);
  }, [selected]);

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
    const isBinary =
      selected.requestBody?.contentType === 'application/octet-stream';

    const res = await fetch(url, {
      method: selected.method.toUpperCase(),
      headers: isBinary
        ? {
            'Content-Type': 'application/octet-stream',
            ...headers,
          }
        : {
            'Content-Type': 'application/json',
            ...headers,
          },
      body: isBinary ? file : selected.requestBody ? body : undefined,
    });
    const text = await res.text();

    let parsed: unknown = text;

    try {
      parsed = JSON.parse(text);
    } catch {
      console.debug('Response is not JSON');
    }

    setResponse({
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      body: parsed,
    });
  }
  function generateCurl() {
    if (!selected) return '';

    let url = 'http://localhost:8080/api/v3' + selected.path;

    for (const p of selected.parameters.filter((p) => p.in === 'path')) {
      url = url.replace(
        `{${p.name}}`,
        encodeURIComponent(params[p.name] ?? '')
      );
    }

    const search = new URLSearchParams();

    for (const p of selected.parameters.filter((p) => p.in === 'query')) {
      if (params[p.name]) {
        search.append(p.name, params[p.name]);
      }
    }

    if (search.toString()) {
      url += '?' + search.toString();
    }

    const isBinary =
      selected.requestBody?.contentType === 'application/octet-stream';

    if (isBinary) {
      return `curl -X ${selected.method.toUpperCase()} "${url}" \
    -H "Content-Type: application/octet-stream" \
    --data-binary "@${file?.name ?? 'file'}"`;
    }

    return `curl -X ${selected.method.toUpperCase()} "${url}" \
    -H "Content-Type: application/json" \
    -d '${body}'`;
  }
  return (
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

              <pre>{JSON.stringify(selected.requestBody.example, null, 2)}</pre>
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
          {selected.requestBody &&
            (isBinary ? (
              <input
                type="file"
                onChange={(e) => {
                  const f = e.target.files?.[0] ?? null;
                  setFile(f);
                }}
              />
            ) : (
              <textarea
                rows={15}
                cols={60}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            ))}
          <h4>Responses</h4>
          <button onClick={() => setCurl(generateCurl())}>Generate cURL</button>
          {curl && (
            <>
              <pre>{curl}</pre>

              <button onClick={() => navigator.clipboard.writeText(curl)}>
                Copy
              </button>
            </>
          )}
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
  );
}
