import { NextResponse } from 'next/server';

import { saveSchema } from '@/lib/saveSchema';

export async function POST(req: Request) {
  const { code } = await req.json();

  try {
    await saveSchema(code);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const typedError = error as Error;
    return NextResponse.json(
      { ok: false, error: typedError.message },
      { status: 400 }
    );
  }
}
