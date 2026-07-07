'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import Loader from '@/components/Loader';
import { OPEN_API_EDITOR_INITIAL_VALUE } from '@/constants/defaultSchema';
import { parseCode } from '@/lib/parse';

type SwaggerEditorProps = {
  initialCode: string;
};

const SwaggerEditor = dynamic(() => import('@/components/SwaggerEditor'), {
  ssr: false,
  loading: () => <Loader variant="fullscreen" />,
});

export default function SwaggerPage({ initialCode }: SwaggerEditorProps) {
  const [code, setCode] = useState(
    initialCode || OPEN_API_EDITOR_INITIAL_VALUE
  );

  const parsed = parseCode(code);

  return (
    <div>
      <SwaggerEditor value={code} onChange={setCode} />
    </div>
  );
}
