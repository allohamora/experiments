import './App.css';
import { FC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const App: FC = () => {
  const { isAuthenticated, isLoading, loginWithPopup, logout } = useAuth0();

  return (
    <div className="app">
      <div className="attributes">{JSON.stringify({ isAuthenticated, isLoading }, null, 2)}</div>

      <div className="buttons">
        <button onClick={() => loginWithPopup()}>login</button>
        <button onClick={() => logout()}>logout</button>
      </div>
    </div>
  );
};
