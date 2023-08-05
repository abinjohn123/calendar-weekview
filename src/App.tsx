import { useState, useMemo } from 'react';
import './App.scss';

import Header from './comonents/Header';
import CalendarGrid from './comonents/CalendarGrid';

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

  return (
    <>
      <Header week={week} setWeek={setWeek} resetWeek={getCurrentWeek} />
      <CalendarGrid week={week} />
    </>
  );
}

export default App;
