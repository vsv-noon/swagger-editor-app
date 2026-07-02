'use client';

import { useEffect, useState } from 'react';

import Details from './EndpointDetails';
import { loadMockSchema } from './mockSchema';

import type { Endpoint } from './types';

export default function Viewer() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [selected, setSelected] = useState<Endpoint | null>(null);

  useEffect(() => {
    loadMockSchema().then(setEndpoints);
  }, []);

  if (!endpoints.length) {
    return <div>Loading...</div>;
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
        <Details selected={selected} />
      </div>
    </div>
  );
}
