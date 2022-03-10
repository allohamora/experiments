import { FC, useState } from 'react';
import {
  Direction,
  Format,
  getDays,
  getTranslatedMonths,
  getTranslatedWeekDays,
  getYear,
  Locale,
  WeekStart,
} from './date';
import styles from './calendar.module.scss';

interface Props {
  onSelect: (selected: Date) => unknown;

  locale?: Locale;
  format?: Format;
  weekStart?: WeekStart;
}

export const Calendar: FC<Props> = ({
  locale = Locale.English,
  format = Format.Short,
  weekStart = WeekStart.Monday,
}) => {
  const [target, setTarget] = useState(new Date());

  const translatedWeekDays = getTranslatedWeekDays(locale, format, weekStart);
  const translatedMonths = getTranslatedMonths(locale, format);

  const days = getDays(target, weekStart);

  const year = getYear(target, locale, Format.Long);
  const month = translatedMonths[target.getMonth()];

  const changeMonth = (direction: Direction) => {
    const newTarget = new Date(target);
    const month = target.getMonth();
    const diff = direction === Direction.Forward ? month + 1 : month - 1;

    newTarget.setMonth(diff);

    setTarget(newTarget);
  };

  const header = (
    <div className={styles.header}>
      <button onClick={() => changeMonth(Direction.Backward)}>{'<'}</button>
      <span>{month}</span>
      <button onClick={() => changeMonth(Direction.Forward)}>{'>'}</button>
    </div>
  );

  const main = (
    <div className={styles.main}>
      <div className={styles.week}>
        {translatedWeekDays.map((day) => (
          <div key={day} className={styles.day}>
            {day}
          </div>
        ))}
      </div>

      <div className={styles.days}>
        {days.map(({ day, inTargetMonth }) => (
          <div key={`${day}-${inTargetMonth}`} data-in-target-month={inTargetMonth} className={styles.day}>
            {day}
          </div>
        ))}
      </div>
    </div>
  );

  const footer = <div className={styles.footer}>{year}</div>;

  return (
    <div className={styles.calendar}>
      {header}
      {main}
      {footer}
    </div>
  );
};
