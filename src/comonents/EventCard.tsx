import React from 'react';
import { useMediaQuery } from 'react-responsive';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import { EventCardProps, eventObject } from '../interfaces';
import { getWeekNumber } from '../helpers/utils';
import { BellIcon, CalendarIcon, CrossIcon } from './svg/svg';

const timeConfig: Intl.DateTimeFormatOptions = {
  minute: '2-digit',
  hour: '2-digit',
  hour12: true,
};

const monthConfig: Intl.DateTimeFormatOptions = {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
};

const getDateString = (date: Date): string => {
  const IntlFormatter = (config: Intl.DateTimeFormatOptions, date: Date) =>
    new Intl.DateTimeFormat('en-US', config).format(date);
  return `${IntlFormatter(monthConfig, date)}, ${IntlFormatter(
    timeConfig,
    date
  ).toLowerCase()}`;
};

const TriggerContent = React.forwardRef<HTMLDivElement, EventCardProps>(
  (props, ref) => {
    const { event, columnIndex, currentWeek, endHour, startHour } = props;
    return (
      <div
        className="event"
        style={
          {
            '--height':
              endHour -
              (new Date(event.start).getDay() === columnIndex - 1 ||
              getWeekNumber(new Date(event.start)) === currentWeek - 1
                ? 0
                : startHour) +
              1,
          } as React.CSSProperties
        }
        ref={ref}
        {...props}
      >
        <p>{event.title}</p>
        <p>
          {new Intl.DateTimeFormat('en-US', timeConfig).format(
            new Date(event.start)
          )}
          {' - '}
          {new Intl.DateTimeFormat('en-US', timeConfig).format(
            new Date(event.end)
          )}
        </p>
      </div>
    );
  }
);

const CardContent = ({ title, start, end }: eventObject) => (
  <div className="event-dialog-content">
    <div className="event-row">
      <div className="event-icon event-color"></div>
      <div className="mb24">
        <h3 className="event-title mb4">{title}</h3>
        <p className="event-date-range">{`${getDateString(
          new Date(start)
        )} - ${getDateString(new Date(end))}`}</p>
      </div>
    </div>
    <div className="event-row mb12">
      <div className="event-icon">
        <BellIcon />
      </div>
      <p className="event-text">30 minutes before</p>
    </div>
    <div className="event-row">
      <div className="event-icon">
        <CalendarIcon />
      </div>
      <p className="event-text">Abin John</p>
    </div>
  </div>
);

const EventCard = (props: EventCardProps) => {
  const { event } = props;
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  return !isMobile ? (
    <Popover.Root modal={true}>
      <Popover.Trigger asChild>
        <TriggerContent {...props} />
      </Popover.Trigger>
      <Popover.Portal
        container={document.getElementById('scrollable-grid-container')}
      >
        <Popover.Content className="PopoverContent" sideOffset={8} side="left">
          <div className="event-dialog-header">
            <Popover.Close asChild>
              <button className="btn-close" aria-label="Close">
                <CrossIcon />
              </button>
            </Popover.Close>
          </div>
          <CardContent {...event} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  ) : (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <TriggerContent {...props} />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="DialogOverlay" />
        <Dialog.Content className="DialogContent">
          <div className="event-dialog-header">
            <Dialog.Close asChild>
              <button className="btn-close" aria-label="Close">
                <CrossIcon />
              </button>
            </Dialog.Close>
          </div>
          <CardContent {...event} />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default EventCard;
