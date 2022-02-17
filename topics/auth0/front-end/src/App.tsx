import './App.css';
import { FC, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const App: FC = () => {
  const { isAuthenticated, isLoading, loginWithPopup, logout, getAccessTokenSilently } = useAuth0();

  const getPrivateData = async () => {
    const token = await getAccessTokenSilently();
    const url = 'http://localhost:4000/private-data';

    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const text = await res.text();

    console.log(text);
  };

  return (
    <div className="app">
      <div className="attributes">{JSON.stringify({ isAuthenticated, isLoading }, null, 2)}</div>

      <div className="buttons">
        <button onClick={() => loginWithPopup()}>login</button>
        <button onClick={() => logout()}>logout</button>
        <button onClick={() => getPrivateData()}>request to back-end</button>
      </div>
    </div>
  );
};
