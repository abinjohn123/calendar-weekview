import { UIEvent } from 'react';
import cx from 'classnames';

const testEvent = {
  title: 'Big assignment',
  start: '2023-08-06T04:20:37.233Z',
  end: '2023-08-06T18:20:37.233Z',
};

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
}

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

const EachRow = ({ rowIndex }: EachRowProps) => {
  return (
    <div className="calendar-weekdays-spacing">
      {DAYS.map((_, index) => {
        const startDate = new Date(testEvent.start);
        const endDate = new Date(testEvent.end);

        return (
          <div
            key={index}
            className="cell"
            data-row={rowIndex}
            data-column={index}
          >
            {rowIndex === startDate.getHours() &&
              index === startDate.getDay() && (
                <div
                  className="event"
                  style={
                    {
                      '--height': endDate.getHours() - startDate.getHours() + 1,
                    } as React.CSSProperties
                  }
                >
                  <p>{testEvent.title}</p>
                </div>
              )}
          </div>
        );
      })}
    </div>
  );
};

const CalendarGrid = ({ week }: CalendarGridProps) => {
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
        <main
          className="scrollable-x"
          id="calendar-grid"
          onScroll={handleGridScroll}
        >
          {timeRows.map((_, index) => (
            <EachRow key={index} rowIndex={index} />
          ))}
        </main>
      </div>
    </div>
  );
};

export default CalendarGrid;
