interface eventObject {
  title: string;
  start: string;
  end: string;
}

export const DB_DETAILS = {
  NAME: 'test-db-new-1',
  START_WEEK_INDEX: 'start_week',
  END_WEEK_INDEX: 'end_week',
};

export const getWeekNumber = (date: Date): number => {
  const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);

  return Math.ceil(
    (date.getTime() - firstDayOfTheYear.getTime()) / 86400000 / 7
  );
};

const events: eventObject[] = [
  {
    title: 'Task 1',
    start: '2023-08-06T04:20:37.233Z',
    end: '2023-08-06T10:20:37.233Z',
  },
  {
    title: 'Task 2',
    start: '2023-08-09T07:20:37.233Z',
    end: '2023-08-10T12:20:37.233Z',
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

export const initializeDB = () => {
  const indexedDB = window.indexedDB;
  const request = indexedDB.open(DB_DETAILS.NAME, 1);

  request.onerror = (event) => {
    console.error('An error occured with IndexedDB');
    console.error(event);
  };

  request.onupgradeneeded = async () => {
    const db = request.result;

    // create a table with unique identified being an 'id' property
    const store = db.createObjectStore('events', { keyPath: 'id' });

    // indexes for faster search
    store.createIndex(DB_DETAILS.START_WEEK_INDEX, 'startWeek', {
      unique: false,
    });
    store.createIndex(DB_DETAILS.END_WEEK_INDEX, 'endWeek', {
      unique: false,
    });
  };

  request.onsuccess = () => {
    const db = request.result;
    const transaction = db.transaction('events', 'readwrite');
    const store = transaction.objectStore('events');

    // add data to databse
    events.forEach((event, index) =>
      store.put({
        ...event,
        id: index + 1,
        startWeek: getWeekNumber(new Date(event.start)),
        endWeek: getWeekNumber(new Date(event.end)),
      })
    );

    // close connection
    transaction.oncomplete = () => db.close();
  };
};
