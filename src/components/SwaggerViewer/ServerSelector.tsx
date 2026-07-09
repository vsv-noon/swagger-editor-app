import { Server } from './types';

interface ServerSelectorProps {
  servers: Server[];
  value: string;
  onChange: (value: string) => void;
}

export function ServerSelector({
  servers,
  value,
  onChange,
}: ServerSelectorProps) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      {servers.map((s) => (
        <option key={s.url} value={s.url}>
          {s.url}
        </option>
      ))}
    </select>
  );
}
