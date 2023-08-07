import { ReactNode, Dispatch, SetStateAction } from 'react';

export interface eventObject {
  title: string;
  start: string;
  end: string;
}
export interface event {
  title: string;
  start: string;
  end: string;
  startWeek: number;
  endWeek: number;
  id: number;
}

export interface CalendarGridProps {
  week: Date[];
  isDBInitializing: boolean;
}

export interface WeekDayProps {
  day: string;
  date: number;
  isToday: boolean;
  isFuture: boolean;
}

export interface EachRowProps {
  rowIndex: number;
  events: event[];
  currentWeek: number;
}

export interface CustomTooltipProps {
  title: string;
  children: ReactNode;
}

export interface HeaderProps {
  week: Date[];
  setWeek: Dispatch<SetStateAction<Date[]>>;
  resetWeek: () => Date[];
}

export interface EventCardProps {
  event: event;
  startHour: number;
  endHour: number;
  columnIndex: number;
  currentWeek: number;
}
