import { UIEvent, useEffect, useState } from 'react';
import cx from 'classnames';

import { DB_DETAILS, getWeekNumber } from './stub';

const testEvent = {
  title: 'Big assignment',
  start: '2023-08-06T04:20:37.233Z',
  end: '2023-08-06T18:20:37.233Z',
};

interface event {
  title: string;
  start: string;
  end: string;
  startWeek: number;
  endWeek: number;
  id: number;
}

interface CalendarGridProps {
  week: Date[];
}

interface WeekDayProps {
  day: string;
  date: number;
  isToday: boolean;
}

interface EachRowProps {
  rowIndex: number;
  events: event[];
  currentWeek: number;
}

const timeConfig: Intl.DateTimeFormatOptions = {
  minute: '2-digit',
  hour: '2-digit',
  hour12: true,
};

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

const WeekDay = ({ day, date, isToday }: WeekDayProps) => {
  return (
    <div className={cx('weekday py16 px8', { today: isToday })}>
      <p className="day">{day}</p>
      <p className="d-flex p8 date">{date}</p>
    </div>
  );
};

const EachRow = ({ rowIndex, events, currentWeek }: EachRowProps) => {
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
              new Date(event.end).getDay() == columnIndex)
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

        if (eventOnDate)
          console.log({
            title: eventOnDate.title,
            startHour,
            endHour,
            startDate: new Date(eventOnDate.start),
            endDate: new Date(eventOnDate.end),
            start: new Date(eventOnDate.start).getDate(),
            end: new Date(eventOnDate.end).getDate(),
            currentWeek: getWeekNumber(new Date()),
          });

        return (
          <div
            key={columnIndex}
            className="cell"
            data-row={rowIndex}
            data-column={columnIndex}
          >
            {eventOnDate && (
              <div
                className="event"
                style={
                  {
                    '--height':
                      endHour -
                      (new Date(eventOnDate.start).getDay() ===
                        columnIndex - 1 ||
                      getWeekNumber(new Date(eventOnDate.start)) ===
                        currentWeek - 1
                        ? 0
                        : startHour) +
                      1,
                  } as React.CSSProperties
                }
              >
                <p>{eventOnDate.title}</p>
                <p>
                  {new Intl.DateTimeFormat('en-US', timeConfig).format(
                    new Date(eventOnDate.start)
                  )}
                  -{' '}
                  {new Intl.DateTimeFormat('en-US', timeConfig).format(
                    new Date(eventOnDate.end)
                  )}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const CalendarGrid = ({ week }: CalendarGridProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<event[]>([]);
  const currentWeek = getWeekNumber(new Date(week[0]));

  useEffect(() => {
    setIsLoading(true);
    const request = window.indexedDB.open(DB_DETAILS.NAME, 1);

    request.onerror = (event) => {
      console.error('An error occured with IndexedDB');
      console.error(event);
    };

    request.onsuccess = () => {
      const db = request.result;
      const transaction = db.transaction('events', 'readwrite');
      const store = transaction.objectStore('events');

      const startWeekIndex = store.index(DB_DETAILS.START_WEEK_INDEX);
      const endWeekIndex = store.index(DB_DETAILS.END_WEEK_INDEX);

      // index query
      const startWeekQuery = startWeekIndex.getAll(currentWeek);
      const endWeekQuery = endWeekIndex.getAll(currentWeek);

      const indexedDBPromise = (request: IDBRequest) =>
        new Promise((resolve, reject) => {
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });

      // success events
      startWeekQuery.onsuccess = () =>
        console.log('startWeekQuery', startWeekQuery.result);
      endWeekQuery.onsuccess = () =>
        console.log('endWeekQuery', endWeekQuery.result);

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

        console.log(finalEvents);
        setEvents(finalEvents);
      });

      // close connection
      transaction.oncomplete = () => db.close();
      setIsLoading(false);
    };
  }, [week]);

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
            />
          ))}
        </div>
      </div>
      <div className="calendar-grid-spacing scrollable-y">
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
              />
            ))}
          </main>
        )}
      </div>
    </div>
  );
};

export default CalendarGrid;
