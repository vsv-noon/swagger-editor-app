'use client';

import { useState } from 'react';

import dynamic from 'next/dynamic';

import Loader from '@/components/Loader';
import { Endpoint } from '@/components/SwaggerViewer/types';
import Viewer from '@/components/SwaggerViewer/Viewer';
import { OPEN_API_EDITOR_INITIAL_VALUE } from '@/constants/defaultSchema';
import { parseCode } from '@/lib/parse';

import styles from './SwaggerPage.module.scss';

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
    <div className={styles.container}>
      <SwaggerEditor value={code} onChange={setCode} />
      <Viewer parsed={parsed?.data} />
    </div>
  );
}
