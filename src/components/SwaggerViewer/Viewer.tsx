'use client';

import { useEffect, useState } from 'react';

import Details from './EndpointDetails';
import { loadMockSchema } from './mockSchema';
import { ServerSelector } from './ServerSelector';
import styles from './viewer.module.scss';

import type { Endpoint, Server } from './types';

type ViewerProps = {
  parsed: unknown;
};

export default function Viewer({ parsed }: ViewerProps) {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [selected, setSelected] = useState<Endpoint | null>(null);
  const [selectedServer, setSelectedServer] = useState('');

  useEffect(() => {
    loadMockSchema(parsed).then(({ endpoints, servers }) => {
      setEndpoints(endpoints);
      setServers(servers);
      setSelectedServer(servers[0]?.url ?? '');
    });
  }, [parsed]);

  if (!endpoints.length) {
    return <div>Loading...</div>;
  }
  const grouped = endpoints.reduce(
    (acc, endpoint) => {
      const group = endpoint.path.split('/')[1];

      if (!acc[group]) {
        acc[group] = [];
      }

      acc[group].push(endpoint);

      return acc;
    },
    {} as Record<string, Endpoint[]>
  );

  return (
    <div className={styles.container}>
      <h3>Servers</h3>

      <div>
        {servers.length > 0 ? (
          <ServerSelector
            servers={servers}
            value={selectedServer}
            onChange={setSelectedServer}
          />
        ) : (
          <p>No servers</p>
        )}
      </div>
      <div className={styles.endpoints}>
        <h3>Endpoints</h3>
        <div className={styles.listOfGroups}>
          {Object.entries(grouped).map(([group, endpoints]) => (
            <div key={group} className={styles.group}>
              <div className={styles.wapperStartPath}>
                <img src={'/viewer_pictures/Vector 1.svg'} />
                <h3
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    setOpenGroup(openGroup === group ? null : group)
                  }
                >
                  {group}
                </h3>
              </div>
              <hr />

              {openGroup === group &&
                endpoints.map((e, i) => (
                  <div
                    key={`${e.method}-${e.path}`}
                    className={styles.endpointWapper}
                    data-method={e.method.toLowerCase()}
                  >
                    <div
                      onClick={() => {
                        setSelected(e);
                        setSelectedIndex(selectedIndex === i ? null : i);
                      }}
                      className={styles.endpoint}
                      data-selected={selectedIndex === i}
                    >
                      <div className={styles.methodPath}>
                        <div className={styles.method}>
                          {' '}
                          <b>{e.method.toUpperCase()}</b>
                        </div>
                        <div className={styles.path}>{e.path}</div>
                      </div>
                      <svg
                        className={styles.icon}
                        width="19"
                        height="32"
                        viewBox="0 0 19 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M1.5 30.5L16.5 16.5L1.5 1.5"
                          stroke="currentColor"
                          fill="none"
                          strokeWidth="3"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    {selected === e && selectedIndex === i && (
                      <Details selected={e} server={selectedServer} />
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
