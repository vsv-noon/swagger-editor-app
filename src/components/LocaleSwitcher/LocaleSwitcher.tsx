import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';

import styles from './LocaleSwitcher.module.scss';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations('LocalSwitcher');

  const changeLocale = (nextLocale: string) => {
    if (!pathname || !searchParams) return;

    const segments = pathname.split('/');
    segments[1] = nextLocale;
    const newPath = segments.join('/');
    const query = searchParams.toString();
    const finalUrl = query ? `${newPath}?${query}` : newPath;

    router.push(finalUrl);
  };

  return (
    <div className={styles.localeSwitcher}>
      <select
        title={t('label')}
        className={styles.select}
        value={locale}
        onChange={(e) => changeLocale(e.target.value)}
      >
        <option value="en">{t('en')}</option>
        <option value="ru">{t('ru')}</option>
      </select>
    </div>
  );
}
