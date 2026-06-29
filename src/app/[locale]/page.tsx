import Viewer from '@/components/SwaggerViewer/Viewer';

import styles from './page.module.scss';

export default async function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Swagger Editor App</h1>
        <Viewer />
      </main>
    </div>
  );
}
