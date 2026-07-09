import { Suspense } from 'react';

import Loader from '@/components/Loader';
import { getLatestSchema } from '@/lib/getSchema';
import SwaggerPage from '@/pages/SwaggerPage/SwaggerPage';

import styles from './page.module.scss';

export default async function Home() {
  const initialCode = await getLatestSchema();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Swagger/OpenAPI UI</h1>
        <Suspense fallback={<Loader variant="fullscreen" />}>
          <SwaggerPage initialCode={initialCode ?? ''} />
        </Suspense>
      </main>
    </div>
  );
}
