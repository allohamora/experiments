import { FC, useState } from 'react';
import { Calendar } from './components/calendar';

export const App: FC = () => {
  const [isShow, setIsShow] = useState(true);

  const toggleIsShow = () => setIsShow(!isShow);
  const calendarSelectHandler = (selected: Date) => {
    console.log({ selected });
  };

  return (
    <>
      <button onClick={toggleIsShow}>toggle show</button>
      {isShow && <Calendar onSelect={calendarSelectHandler} />}
    </>
  );
};
