import cx from 'classnames';

interface CalendarGridProps {
  week: Date[];
}

interface WeekDayProps {
  day: string;
  date: number;
  isToday: boolean;
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

const WeekDay = ({ day, date, isToday }: WeekDayProps) => {
  return (
    <div className={cx('weekday py16 px8', { today: isToday })}>
      <p className="day">{day}</p>
      <p className="d-flex p8 date">{date}</p>
    </div>
  );
};

const EachRow = () => {
  return (
    <div className="calendar-weekdays-spacing">
      {DAYS.map((_, index) => (
        <div key={index} className="cell"></div>
      ))}
    </div>
  );
};

const CalendarGrid = ({ week }: CalendarGridProps) => {
  return (
    <div className="calendar-container">
      <div className="calendar-grid-spacing">
        <div className="empty"></div>
        <div className="grid-header scrollable-x">
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
        <main className="scrollable-x">
          {timeRows.map((_, index) => (
            <EachRow key={index} />
          ))}
        </main>
      </div>
    </div>
  );
};

export default CalendarGrid;
