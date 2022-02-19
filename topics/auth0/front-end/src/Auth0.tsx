import { FC } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

const env = (name: string) => import.meta.env[name] as string;

export const Auth0: FC = ({ children }) => {
  return (
    <Auth0Provider
      domain={env('VITE_AUTH0_DOMAIN')}
      clientId={env('VITE_AUTH0_CLIENT_ID')}
      audience={env('VITE_AUTH0_AUDIENCE')}
      scope="read:private-data"
      redirectUri={window.location.origin}
    >
      {children}
    </Auth0Provider>
  );
};
