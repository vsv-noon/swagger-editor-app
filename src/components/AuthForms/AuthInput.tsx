import { useTranslations } from 'next-intl';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

import styles from './AuthForms.module.scss';

type AuthInputProps<T extends FieldValues> = {
  control: Control<T>;
  name: Path<T>;
  id: string;
  type: string;
  htmlFor: string;
  label: string;
};

export const AuthInput = <T extends FieldValues>(props: AuthInputProps<T>) => {
  const t = useTranslations('SignForm');

  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field, fieldState: { error } }) => (
        <div className={styles.formItem}>
          <div className={styles.authInputContainer}>
            <label htmlFor={props.htmlFor}>{t(props.label)}:</label>
            <input
              id={props.id}
              type={props.type}
              className={styles.authInput}
              required
              {...field}
            ></input>
          </div>
          {error && (
            <span className={styles.authErrorMsg}>{error.message}</span>
          )}
        </div>
      )}
    ></Controller>
  );
};
