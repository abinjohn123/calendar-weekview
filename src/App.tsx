import { useState, useEffect } from 'react';
import './App.scss';

import Header from './comonents/Header';
import CalendarGrid from './comonents/CalendarGrid';
import { initializeDB } from './comonents/stub';

const getCurrentWeek = () => {
  const currentDate = new Date();
  const newWeek = [];

  for (let i = 0; i <= 6; i++) {
    const first = currentDate.getDate() - currentDate.getDay() + i;
    const day = new Date(currentDate.setDate(first));
    newWeek.push(day);
  }

  return newWeek;
};

function App() {
  const [week, setWeek] = useState<Date[]>(getCurrentWeek());
  const [isDBInitializing, setIsDBInitializing] = useState<boolean>(false);

  useEffect(() => initializeDB(setIsDBInitializing), []);

  return (
    <>
      <Header week={week} setWeek={setWeek} resetWeek={getCurrentWeek} />
      <CalendarGrid week={week} isDBInitializing={isDBInitializing} />
    </>
  );
}

export default App;
