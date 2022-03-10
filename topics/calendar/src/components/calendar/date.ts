import { capitalize } from 'src/utils/string';

export type DateDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export enum Locale {
  English = 'en',
  Ukraine = 'uk',
}

export enum Format {
  Long = 'long',
  Short = 'short',
  Narrow = 'narrow',
}

export enum WeekStart {
  Sunday = 0,
  Monday = 1,
}

export enum Direction {
  Forward = 'Forward',
  Backward = 'Backward',
}

export const getTranslatedMonths = (locale: Locale = Locale.English, format: Format = Format.Short) => {
  const dateMonths = Array.from({ length: 12 }, (_, i) => new Date(1970, i + 0, 1));
  const dateFormatter = Intl.DateTimeFormat(locale, { month: format });
  const months = dateMonths.map((date) => dateFormatter.format(date));

  return months.map((month) => capitalize(month));
};

export const getTranslatedWeekDays = (
  locale: Locale = Locale.English,
  format: Format = Format.Short,
  weekStart: WeekStart = WeekStart.Sunday,
) => {
  const dateWeekDays = Array.from({ length: 7 }, (_, i) => new Date(1970, 0, i + weekStart + 4));
  const dateFormatter = Intl.DateTimeFormat(locale, { weekday: format });
  const weekDays = dateWeekDays.map((date) => dateFormatter.format(date));

  return weekDays.map((day) => capitalize(day));
};

export const getYear = (date: Date, locale: Locale = Locale.English, format: Format = Format.Short) => {
  const year = format === Format.Long ? 'numeric' : '2-digit';
  const dateFormatter = Intl.DateTimeFormat(locale, { year });

  return dateFormatter.format(date);
};

const clearTime = (date: Date) => {
  date.setHours(0, 0, 0, 0);
};

const getMonthFirstDay = (date: Date) => {
  const firstDay = new Date(date);
  firstDay.setDate(1);

  clearTime(firstDay);

  return firstDay;
};

const getMonthLastDay = (date: Date) => {
  const lastDay = new Date(date);
  lastDay.setMonth(lastDay.getMonth() + 1);
  lastDay.setDate(0);

  clearTime(lastDay);

  return lastDay;
};

const findFirstDay = (start: Date, targetDay: DateDay, direction: Direction) => {
  let current = new Date(start);

  while (current.getDay() !== targetDay) {
    const monthDay = current.getDate();
    const diff = direction === Direction.Forward ? monthDay + 1 : monthDay - 1;

    current.setDate(diff);
  }

  return current;
};

const getCalendarFirstDay = (date: Date, weekStart: WeekStart) => {
  const monthFirstDay = getMonthFirstDay(date);

  if (monthFirstDay.getDay() === weekStart) {
    return monthFirstDay;
  }

  return findFirstDay(monthFirstDay, weekStart, Direction.Backward);
};

const getCalendarLastDay = (date: Date, weekStart: WeekStart) => {
  const monthLastDay = getMonthLastDay(date);
  const lastDay = weekStart === WeekStart.Monday ? 0 : 6;

  if (monthLastDay.getDay() === lastDay) {
    return monthLastDay;
  }

  return findFirstDay(monthLastDay, lastDay, Direction.Forward);
};

const toMonthWithDay = (date: Date) => {
  return `${date.getDate()}/${date.getMonth()}`;
};

export const getDatesInRange = (start: Date, end: Date) => {
  const result = [new Date(start)];
  const endMonthWithDay = toMonthWithDay(end);

  let current = new Date(start);

  while (toMonthWithDay(current) !== endMonthWithDay) {
    current.setDate(current.getDate() + 1);

    result.push(new Date(current));
  }

  return result;
};

export const getDays = (target: Date, weekStart: WeekStart = WeekStart.Sunday) => {
  const calendarFirstDay = getCalendarFirstDay(target, weekStart);
  const calendarLastDay = getCalendarLastDay(target, weekStart);
  const dates = getDatesInRange(calendarFirstDay, calendarLastDay);
  const month = target.getMonth();

  return dates.map((date) => ({
    inTargetMonth: date.getMonth() === month,
    day: date.getDate(),
    date,
  }));
};
