import './App.css';
import { FC } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

export const App: FC = () => {
  const { isAuthenticated, isLoading, loginWithPopup, logout, getAccessTokenSilently } = useAuth0();

  const request = async ({ url }: { url: string }) => {
    const token = await getAccessTokenSilently();

    return await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  };

  const requestPrivateData = async () => {
    const res = await request({ url: 'http://localhost:4000/private-data' });
    const privateData = await res.text();

    console.log(privateData);
  };

  const requestMe = async () => {
    const res = await request({ url: 'http://localhost:4000/me' });
    const me = await res.json();

    console.log(me);
  };

  return (
    <div className="app">
      <div className="attributes">{JSON.stringify({ isAuthenticated, isLoading }, null, 2)}</div>

      <div className="buttons">
        <button onClick={() => loginWithPopup()}>login</button>
        <button onClick={() => logout()}>logout</button>
        <button onClick={() => requestPrivateData()}>request private data</button>
        <button onClick={() => requestMe()}>request me</button>
      </div>
    </div>
  );
};
