import { FC, useState } from 'react';
import { oneOfEnum } from 'src/utils/prompt';
import { Calendar, Mode } from '../calendar';
import { Format, Locale, WeekStart } from '../calendar/date';
import styles from './calendar-demo.module.scss';

export const CalendarDemo: FC = () => {
  const [mode, setMode] = useState(Mode.Range);
  const [monthFormat, setMonthFormat] = useState(Format.Short);
  const [locale, setLocale] = useState(Locale.English);
  const [weekStart, setWeekStart] = useState(WeekStart.Monday);
  const [isShow, setIsShow] = useState(false);

  const toggleIsShow = () => setIsShow(!isShow);
  const calendarSelectHandler = (selected: Date[]) => {
    console.log({ selected });
    setIsShow(false);
  };

  return (
    <div className={styles['calendar-demo']}>
      <div className={styles.buttons}>
        <button onClick={toggleIsShow}>toggle show</button>
        <button onClick={() => oneOfEnum('mode', Mode, setMode, mode)}>change mode</button>
        <button onClick={() => oneOfEnum('format', Format, setMonthFormat, monthFormat)}>change month format</button>
        <button onClick={() => oneOfEnum('locale', Locale, setLocale, locale)}>change locale</button>
        <button onClick={() => oneOfEnum('weekStart', WeekStart, (v) => setWeekStart(v as WeekStart), weekStart)}>
          change weekStart
        </button>
      </div>

      {isShow && (
        <Calendar
          weekStart={weekStart}
          locale={locale}
          mode={mode}
          monthFormat={monthFormat}
          onSelect={calendarSelectHandler}
        />
      )}
    </div>
  );
};
