import { Dispatch, SetStateAction } from 'react';

import { accessIndexedDB } from '../helpers/indexedDB';
import { getWeekNumber, indexedDBPromise } from '../helpers/utils';

interface eventObject {
  title: string;
  start: string;
  end: string;
}

const events: eventObject[] = [
  {
    title: 'Task 1',
    start: '2023-08-06T04:20:37.233Z',
    end: '2023-08-06T10:20:37.233Z',
  },
  {
    title: 'Task 2',
    start: '2023-08-09T07:20:37.233Z',
    end: '2023-08-10T05:20:37.233Z',
  },
  {
    title: 'Task 3',
    start: '2023-08-12T15:20:37.233Z',
    end: '2023-08-13T05:15:37.233Z',
  },
  {
    title: 'Task 4',
    start: '2023-08-04T02:20:37.233Z',
    end: '2023-08-04T12:20:37.233Z',
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
