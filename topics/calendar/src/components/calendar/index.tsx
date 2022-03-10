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
import { cls } from 'src/utils/cls';

export enum Mode {
  Single = 'Single',
  Range = 'Range',
}

interface Props {
  onSelect: (selected: Date[]) => unknown;

  locale?: Locale;
  format?: Format;
  weekStart?: WeekStart;
  mode?: Mode;
}

const inSelectionRange = (target: Date, from: Date | null, moveOn: Date | null) => {
  if (from === null) {
    return false;
  }

  const fromTime = from.getTime();
  const targetTime = target.getTime();

  if (fromTime === targetTime) {
    return true;
  }

  if (moveOn === null) {
    return false;
  }

  const moveOnTime = moveOn.getTime();

  const isInBackwardRange = fromTime >= targetTime && moveOnTime <= targetTime;
  const isInForwardRange = fromTime <= targetTime && moveOnTime >= targetTime;

  return isInBackwardRange || isInForwardRange;
};

export const Calendar: FC<Props> = ({
  locale = Locale.English,
  format = Format.Short,
  weekStart = WeekStart.Monday,
  mode = Mode.Single,
  onSelect,
}) => {
  const [target, setTarget] = useState(new Date());
  const [from, setFrom] = useState<Date | null>(null);
  const [moveOn, setMoveOn] = useState<Date | null>(null);

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

  const singleModeHandler = (date: Date) => {
    return onSelect([date]);
  };

  const rangeModeHandler = (date: Date) => {
    if (from === null) {
      return setFrom(date);
    }

    if (from.toString() === date.toString()) {
      return;
    }

    onSelect([from, date]);
    setFrom(null);
  };

  const dayClickHandler = (date: Date) => () => {
    switch (mode) {
      case Mode.Single:
        return singleModeHandler(date);
      case Mode.Range:
        return rangeModeHandler(date);
      default:
        return console.warn(`invalid mode ${mode}`);
    }
  };

  const dayPointerMoveHandler = (date: Date) => () => {
    if (mode === Mode.Single || from === null) {
      return;
    }

    setMoveOn(date);
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
        {days.map(({ day, outOfMonth, date }) => {
          const key = date.toString();
          const isInSelectionRange = inSelectionRange(date, from, moveOn);

          const className = cls(
            styles.day,
            outOfMonth && styles['out-of-month'],
            isInSelectionRange && styles['in-selection-range'],
          );

          return (
            <div
              key={key}
              className={className}
              onClick={dayClickHandler(date)}
              onPointerMove={dayPointerMoveHandler(date)}
            >
              {day}
            </div>
          );
        })}
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
