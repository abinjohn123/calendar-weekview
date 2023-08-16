import { UIEvent, useEffect, useState } from 'react';
import cx from 'classnames';

import { getWeekNumber, indexedDBPromise } from '../helpers/utils';
import {
  event,
  CalendarGridProps,
  WeekDayProps,
  EachRowProps,
} from '../interfaces';
import { DB_DETAILS, accessIndexedDB } from '../helpers/indexedDB';
import EventCard from './EventCard';

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const timeRows: string[] = [];

['AM', 'PM'].forEach((type) => {
  for (let i = 0; i < 12; ++i) {
    if (i === 0) {
      timeRows.push(`12 ${type}`);
      continue;
    }

    timeRows.push(`${i} ${type}`);
  }
});

const handleHeaderScroll = (e: UIEvent<HTMLDivElement>): void => {
  const gridEl = document.getElementById('calendar-grid');
  if (gridEl)
    gridEl.scrollLeft = (e.target as HTMLInputElement).scrollLeft ?? 0;
};

const handleGridScroll = (e: UIEvent<HTMLDivElement>): void => {
  const headerEl = document.getElementById('calendar-header');
  if (headerEl)
    headerEl.scrollLeft = (e.target as HTMLInputElement).scrollLeft ?? 0;
};

const WeekDay = ({ day, date, isToday, isFuture }: WeekDayProps) => {
  return (
    <div className={cx('weekday py16 px8', { today: isToday })}>
      <p className="day">{day}</p>
      <p className={cx('d-flex p8 date', { future: isFuture })}>{date}</p>
    </div>
  );
};

const EachRow = ({
  rowIndex,
  events,
  currentWeek,
  currentTime,
}: EachRowProps) => {
  const currentHour = currentTime.getHours();
  const currentDay = currentTime.getDay();
  const timeOffset = currentTime.getMinutes();
  return (
    <div className="calendar-weekdays-spacing">
      {DAYS.map((_, columnIndex) => {
        const eventOnDate = events.find((event) => {
          return (
            //event starts and finishes on current day
            (getWeekNumber(new Date(event.start)) === currentWeek &&
              new Date(event.start).getHours() === rowIndex &&
              new Date(event.start).getDay() === columnIndex) ||
            // event starts on previous day of the same week
            (rowIndex === 0 &&
              new Date(event.start).getDay() === columnIndex - 1 &&
              new Date(event.end).getDay() !== columnIndex - 1) ||
            // event starts on the previous week
            (rowIndex === 0 &&
              getWeekNumber(new Date(event.start)) === currentWeek - 1 &&
              new Date(event.end).getDay() === columnIndex)
          );
        });

        const startHour: number = eventOnDate
          ? new Date(eventOnDate.start).getHours()
          : 0;
        const endHour: number = eventOnDate
          ? new Date(eventOnDate.end).getDay() === columnIndex
            ? new Date(eventOnDate.end).getHours()
            : 23
          : 0;

        const showTimeIndicator =
          getWeekNumber(new Date()) === currentWeek &&
          currentDay === columnIndex &&
          currentHour === rowIndex;

        return (
          <div
            key={columnIndex}
            className="cell"
            data-row={rowIndex}
            data-column={columnIndex}
          >
            {eventOnDate && (
              <EventCard
                event={eventOnDate}
                startHour={startHour}
                endHour={endHour}
                columnIndex={columnIndex}
                currentWeek={currentWeek}
              />
            )}
            {showTimeIndicator && (
              <div
                className="current-time-line"
                style={{ '--offset': timeOffset } as React.CSSProperties}
              ></div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const CalendarGrid = ({ week, isDBInitializing }: CalendarGridProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<event[]>([]);
  const currentWeek = getWeekNumber(new Date(week[0]));
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (isDBInitializing) return;

    setIsLoading(true);
    accessIndexedDB(async (request: IDBOpenDBRequest) => {
      const db = request.result;
      const transaction = db.transaction('events', 'readwrite');
      const store = transaction.objectStore('events');

      const startWeekIndex = store.index(DB_DETAILS.START_WEEK_INDEX);
      const endWeekIndex = store.index(DB_DETAILS.END_WEEK_INDEX);

      // index query
      const startWeekQuery = startWeekIndex.getAll(currentWeek);
      const endWeekQuery = endWeekIndex.getAll(currentWeek);

      // success events
      Promise.all([
        indexedDBPromise(startWeekQuery),
        indexedDBPromise(endWeekQuery),
      ]).then(([result1, result2]) => {
        // Combine the results, removing duplicates
        const startWeekEvents = result1 as Array<event>;
        const endWeekEvents = result2 as Array<event>;

        const finalEvents = [
          ...startWeekEvents,
          ...endWeekEvents.filter((endEvent) =>
            startWeekEvents.every((startEvent) => startEvent.id !== endEvent.id)
          ),
        ];
        setEvents(finalEvents);
      });

      // close connection
      transaction.oncomplete = () => db.close();
      setIsLoading(false);
    });
  }, [currentWeek, isDBInitializing]);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="calendar-container">
      <div className="calendar-grid-spacing">
        <div className="empty"></div>
        <div
          className="grid-header scrollable-x"
          id="calendar-header"
          onScroll={handleHeaderScroll}
        >
          {DAYS.map((day, dayIndex) => (
            <WeekDay
              key={dayIndex}
              day={day}
              date={week[dayIndex].getDate()}
              isToday={
                week[dayIndex].toDateString() === new Date().toDateString()
              }
              isFuture={week[dayIndex] > new Date()}
            />
          ))}
        </div>
      </div>
      <div
        className="calendar-grid-spacing scrollable-y"
        id="scrollable-grid-container"
      >
        <div className="sidebar">
          {timeRows.map((time, index) => (
            <div className="time-cell" key={index}>
              <span className="time">{time}</span>
            </div>
          ))}
        </div>
        {!isLoading && (
          <main
            className="scrollable-x"
            id="calendar-grid"
            onScroll={handleGridScroll}
          >
            {timeRows.map((_, index) => (
              <EachRow
                key={index}
                rowIndex={index}
                events={events}
                currentWeek={currentWeek}
                currentTime={currentTime}
              />
            ))}
          </main>
        )}
      </div>
    </div>
  );
};

export default CalendarGrid;
