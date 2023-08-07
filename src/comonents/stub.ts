import { Dispatch, SetStateAction } from 'react';

import { accessIndexedDB } from '../helpers/indexedDB';
import { eventObject } from '../interfaces';
import { getWeekNumber, indexedDBPromise } from '../helpers/utils';

const events: eventObject[] = [
  {
    title: 'Meeting with John Doe',
    start: '2023-08-06T04:20:37.233Z',
    end: '2023-08-06T09:30:00.233Z',
  },
  {
    title: 'Last9 Assignment',
    start: '2023-08-09T07:00:37.233Z',
    end: '2023-08-10T04:45:00.233Z',
  },
  {
    title: 'Task 3',
    start: '2023-08-12T15:20:37.233Z',
    end: '2023-08-13T05:15:37.233Z',
  },
  {
    title: 'House cleaning',
    start: '2023-08-04T04:50:37.233Z',
    end: '2023-08-04T12:20:15.233Z',
  },
];

export const initializeDB = (
  setIsDBInitializing: Dispatch<SetStateAction<boolean>>
) => {
  setIsDBInitializing(true);

  accessIndexedDB(async (request) => {
    const db = request.result;
    const transaction = db.transaction('events', 'readwrite');
    const store = transaction.objectStore('events');

    // check if data exists in db
    const isDataExisting = await indexedDBPromise(store.getAll());

    // add data to databse
    if (!(isDataExisting as eventObject[]).length) {
      events.forEach((event, index) =>
        store.put({
          ...event,
          id: index + 1,
          startWeek: getWeekNumber(new Date(event.start)),
          endWeek: getWeekNumber(new Date(event.end)),
        })
      );
    }

    // close connection
    transaction.oncomplete = () => db.close();
    setIsDBInitializing(false);
  });
};
