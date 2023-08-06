export const getWeekNumber = (date: Date): number => {
  const firstDayOfTheYear = new Date(date.getFullYear(), 0, 1);

  return Math.ceil(
    (date.getTime() - firstDayOfTheYear.getTime()) / 86400000 / 7
  );
};

export const indexedDBPromise = (request: IDBRequest) =>
  new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
