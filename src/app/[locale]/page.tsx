import { Suspense } from 'react';

import { getLatestSchema } from '@/lib/getSchema';
import SwaggerPage from '@/pages/SwaggerPage/SwaggerPage';

import styles from './page.module.scss';

export default async function Home() {
  const initialCode = await getLatestSchema();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Swagger/OpenAPI UI</h1>
        <Suspense>
          <SwaggerPage initialCode={initialCode ?? ''} />
        </Suspense>
      </main>
    </div>
  );
}
