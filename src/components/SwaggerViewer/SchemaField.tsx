import { isObject } from './parseOpenApi';
import SchemaViewer from './SchemaViewer';
import { JsonValue, OpenApiSchema } from './types';

interface FieldProps {
  name: string;
  schema: OpenApiSchema;
}
export function SchemaField({ name, schema }: FieldProps) {
  if (!isObject(schema)) {
    return null;
  }

  return (
    <div style={{ marginBottom: 8 }}>
      <b>{name}</b>{' '}
      {typeof schema.type === 'string' && <span>{schema.type}</span>}
      {typeof schema.format === 'string' && <span> ({schema.format})</span>}
      {isObject(schema.properties) && <SchemaViewer schema={schema} />}
    </div>
  );
}
