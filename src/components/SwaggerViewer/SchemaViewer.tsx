import { SchemaField } from './SchemaField';
import { JsonValue, OpenApiSchema } from './types';

interface Props {
  schema: OpenApiSchema;
}

export default function SchemaViewer({ schema }: Props) {
  const properties = schema.properties;

  if (!properties) {
    return null;
  }

  return (
    <div style={{ paddingLeft: 20 }}>
      {Object.entries(properties).map(([name, value]) => (
        <SchemaField key={name} name={name} schema={value} />
      ))}
    </div>
  );
}
