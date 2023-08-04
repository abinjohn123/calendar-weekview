import { useState, useEffect } from 'react';
import './App.scss';

import Header from './comonents/Header';

function App() {
  const [week, setWeek] = useState<Date[]>([]);

  const getWeekData = () => {
    const currentDate = new Date();
    const newWeek = [];

    for (let i = 0; i <= 6; i++) {
      const first = currentDate.getDate() - currentDate.getDay() + i;
      const day = new Date(currentDate.setDate(first));
      newWeek.push(day);
    }

    setWeek(newWeek);
  };

  useEffect(getWeekData, []);

  console.log(week);

  return (
    <>
      <Header week={week} setWeek={setWeek} />
    </>
  );
}

export default App;
