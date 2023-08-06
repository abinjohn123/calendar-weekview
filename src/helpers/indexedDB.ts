export const DB_DETAILS = {
  NAME: 'test-db-2',
  START_WEEK_INDEX: 'start_week',
  END_WEEK_INDEX: 'end_week',
};

export const accessIndexedDB = (
  successCallback: (request: IDBOpenDBRequest) => void
) => {
  const indexedDB = window.indexedDB;
  if (!indexedDB) return console.error('Failed to initialize!');

  const request = indexedDB.open(DB_DETAILS.NAME, 1);

  // error handling
  request.onerror = (event) => {
    console.error('An error occured with IndexedDB');
    console.error(event);
  };

  // db creation if it doesn't exist
  request.onupgradeneeded = () => {
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

  // success
  request.onsuccess = () => successCallback(request);
};

export default accessIndexedDB;
