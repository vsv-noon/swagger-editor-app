import SwaggerParser from '@apidevtools/swagger-parser';
import { parse } from 'yaml';

import { detectFormat } from './parse';
import { createClient } from './supabase/client';

export async function saveSchema(code: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Not authenticated');
  }

  if (!code.trim()) {
    throw new Error('Empty schema');
  }

  let parsed;

  try {
    parsed = parse(code);
  } catch {
    throw new Error('Invalid YAML/JSON');
  }

  try {
    await SwaggerParser.validate(parsed);
  } catch (error) {
    const typedError = error as Error;
    throw new Error(typedError.message || 'Invalid OpenAPI schema');
  }

  const { error } = await supabase.from('schemas').insert([
    {
      schema: parsed,
      format: detectFormat(code),
      user_id: user.id,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}
