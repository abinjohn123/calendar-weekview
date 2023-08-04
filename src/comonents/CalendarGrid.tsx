interface CalendarGridProps {
  week: Date[];
}

interface WeekDayProps {
  day: string;
  date: number;
}

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const timeRows: string[] = [];

['AM', 'PM'].forEach((type) => {
  for (let i = 0; i < 13; ++i) {
    if (type === 'PM' && i === 12) continue;

    timeRows.push(`${i} ${type}`);
  }
});

const WeekDay = ({ day, date }: WeekDayProps) => {
  return (
    <div className="weekday py16 px8">
      <p className="day">{day}</p>
      <p className="date">{date}</p>
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
            <WeekDay key={dayIndex} day={day} date={week[dayIndex].getDate()} />
          ))}
        </div>
      </div>
      <div className="calendar-grid-spacing scrollable-y">
        <div className="">
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
