import { AuthProvider } from 'react-admin';

const users = [
  { id: 0, username: 'admin', password: 'admin', roles: ['admin', 'editor'] },
  { id: 1, username: 'editor', password: 'editor', roles: ['editor'] },
];

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    const user = users.find((innerUser) => innerUser.username === username && innerUser.password === password);

    if (!user) {
      throw new Error('user not found');
    }

    localStorage.setItem('auth', JSON.stringify(user));
  },
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem('auth');
      return Promise.reject();
    }

    // other error code (404, 500, etc): no need to log out
    return Promise.resolve();
  },
  checkAuth: () => {
    const auth = localStorage.getItem('auth');

    return auth ? Promise.resolve() : Promise.reject();
  },
  logout: () => {
    localStorage.removeItem('auth');

    return Promise.resolve();
  },
  getIdentity: () => {
    try {
      const { id, username: fullName, avatar = '/avatar.svg' } = JSON.parse(localStorage.getItem('auth') ?? 'null');

      return Promise.resolve({ id, fullName, avatar });
    } catch (error) {
      return Promise.reject(error);
    }
  },
  getPermissions: () => {
    const auth = JSON.parse(localStorage.getItem('auth') ?? 'null');

    if (!auth) {
      return Promise.reject();
    }

    return Promise.resolve(auth.roles);
  },
};
