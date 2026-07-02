import SwaggerPage from '@/pages/SwaggerPage/SwaggerPage';

import styles from './page.module.scss';

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Swagger/OpenAPI UI</h1>
        <SwaggerPage />
      </main>
    </div>
  );
}
