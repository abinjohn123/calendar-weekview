import { Dispatch, SetStateAction } from 'react';

import CustomTooltip from './CustomTooltip';
import { LeftChevronIcon, RightChevronIcon } from './svg/svg';

interface HeaderProps {
  week: Date[];
  setWeek: Dispatch<SetStateAction<Date[]>>;
  resetWeek: () => Date[];
}

const dateConfigWithoutYear: Intl.DateTimeFormatOptions = {
  month: 'long',
};

const dateConfigWithYear: Intl.DateTimeFormatOptions = {
  ...dateConfigWithoutYear,
  year: 'numeric',
};

const responsiveConfig = (config: {}): {} => ({
  ...config,
  month: window.innerWidth < 768 ? 'short' : 'long',
});

const getCurrentDate = (): string =>
  Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date());

const Header = ({ week, setWeek, resetWeek }: HeaderProps) => {
  const [firstDay, lastDay] = [week[0], week[6]];

  const getMonth = (): string => {
    if (week.length === 0) return '';

    if (firstDay.getMonth() === lastDay.getMonth()) {
      return new Intl.DateTimeFormat('en-US', dateConfigWithYear).format(
        lastDay
      );
    }

    if (firstDay.getFullYear() === lastDay.getFullYear())
      return `${new Intl.DateTimeFormat(
        'en-US',
        responsiveConfig(dateConfigWithoutYear)
      ).format(firstDay)} - ${new Intl.DateTimeFormat(
        'en-US',
        responsiveConfig(dateConfigWithYear)
      ).format(lastDay)}`;

    return `${new Intl.DateTimeFormat(
      'en-US',
      responsiveConfig(dateConfigWithYear)
    ).format(firstDay)} - ${new Intl.DateTimeFormat(
      'en-US',
      responsiveConfig(dateConfigWithYear)
    ).format(lastDay)}`;
  };

  const handleWeekChange = (type: number): void =>
    setWeek(
      week.map((date) => new Date(date.setDate(date.getDate() + type * 7)))
    );

  return (
    <div className="d-flex-c-start gap18 calendar-header">
      <CustomTooltip title={getCurrentDate()}>
        <button
          className="btn cur-p px12 py12 btn--today"
          onClick={() => setWeek(resetWeek())}
        >
          Today
        </button>
      </CustomTooltip>
      <div className="d-flex gap4">
        <CustomTooltip title="Previous week">
          <div
            className="change-week cur-p"
            onClick={() => handleWeekChange(-1)}
          >
            <LeftChevronIcon />
          </div>
        </CustomTooltip>
        <CustomTooltip title="Next week">
          <div
            className="change-week cur-p"
            onClick={() => handleWeekChange(1)}
          >
            <RightChevronIcon />
          </div>
        </CustomTooltip>
      </div>
      <p className="month">{getMonth()}</p>
    </div>
  );
};

export default Header;
