import { useEffect, useState } from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { executeRequest } from '@/lib/executeRequest';

import styles from './details.module.scss';
import SchemaExampleViewer from './SchemaExampleViewer';
import { Endpoint } from './types';

interface Props {
  selected: Endpoint | null;
  server: string;
}
export default function Details({ selected, server }: Props) {
  const [params, setParams] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [body, setBody] = useState('');

  const [file, setFile] = useState<File | null>(null);
  const [curl, setCurl] = useState('');

  const contentType = selected?.requestBody?.contentType;
  const isBinary = contentType === 'application/octet-stream';
  const showJsonEditor =
    contentType === 'application/json' || contentType === 'application/*+json';
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

    const pathParams: Record<string, string> = {};
    const queryParams: Record<string, string> = {};

    for (const p of selected.parameters ?? []) {
      const value = params[p.name];

      if (value === undefined || value === null) continue;

      if (p.in === 'path') {
        pathParams[p.name] = String(value);
      }
      if (p.in === 'query') {
        queryParams[p.name] = String(value);
      }
    }

    const isBinary =
      selected.requestBody?.contentType === 'application/octet-stream';

    const reqHeaders: Record<string, string> = { ...headers };

    if (isBinary) {
      reqHeaders['Content-Type'] = 'application/octet-stream';
    } else {
      reqHeaders['Content-Type'] =
        selected.requestBody?.contentType ?? 'application/json';
    }

    const cleanedBody = body ?? undefined;

    const res = await executeRequest({
      server: server,
      path: selected.path,
      method: selected.method,
      pathParams,
      queryParams,
      headers: reqHeaders,
      isBinary,
      body: selected.requestBody ? cleanedBody : undefined,
    });

    const data = await res.json();

    setResponse({
      status: data.status,
      headers: data.headers,
      body: data.body,
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
    <div className={styles.details}>
      <h3>Details</h3>

      {!selected ? (
        <div>Select endpoint</div>
      ) : (
        <>
          <div className={styles.title}>
            <h4>Parameters</h4>
          </div>

          {selected.parameters.length === 0 ? (
            <div>No parameters</div>
          ) : (
            selected.parameters.map((p, i) => (
              <div key={i}>
                {p.name} — {p.in} {p.required ? '(required)' : ''}
              </div>
            ))
          )}

          <div className={styles.title}>
            <h4>Request Body</h4>
          </div>

          {selected.requestBody ? (
            <>
              <div>
                <b>Content type:</b> {selected.requestBody.contentType}
              </div>

              <SchemaExampleViewer
                schema={selected.requestBody.schema}
                example={selected.requestBody.example}
              />
            </>
          ) : (
            <div>No request body</div>
          )}
          <div className={styles.try}>
            <button onClick={execute}>Try it Out</button>
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
                showJsonEditor && (
                  <textarea
                    rows={15}
                    cols={60}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                )
              ))}
          </div>
          <div className={styles.title}>
            <h4>Responses</h4>
          </div>
          <button onClick={() => setCurl(generateCurl())}>Generate cURL</button>
          {curl && (
            <>
              <pre>
                <SyntaxHighlighter
                  language="bash"
                  style={vs}
                  className={styles.code}
                >
                  {curl}
                </SyntaxHighlighter>
              </pre>

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

              {response.schema !== undefined &&
                response.example !== undefined && (
                  <SchemaExampleViewer
                    schema={response.schema}
                    example={response.example}
                  />
                )}
            </div>
          ))}
        </>
      )}
    </div>
  );
}
