import { FC } from 'react';
import { Auth0Provider } from '@auth0/auth0-react';

export const Auth0: FC = ({ children }) => {
  return (
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN as string}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID as string}
      redirectUri={window.location.origin}
    >
      {children}
    </Auth0Provider>
  );
};
