import AsyncStorage from '@react-native-async-storage/async-storage';

import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext({
  token: '',
  isAuthenticated: false,
  authenticate: (token) => {},
  logout: () => {},
  resumeToken: () => {},
});

function AuthContextProvider({ children }) {
  const [authToken, setAuthToken] = useState();

  const setLogoutTimer = (expirationTime) => {
    console.log(expirationTime);
    setTimeout(async () => {
      await logout();
    }, expirationTime);
  };

  const authenticate = async (token, expiresIn) => {
    // Set token and expiration time in AsyncStorage
    await AsyncStorage.setItem('token', token);
    const expirationTime = Date.now() + expiresIn * 1000;
    await AsyncStorage.setItem('tokenExpiration', expirationTime.toString());

    setAuthToken(token);
    await AsyncStorage.setItem('token', token);
    setLogoutTimer(expiresIn * 1000);
  }

  const resumeToken = (token) => {
    setAuthToken(token);
  }

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('tokenExpiration');
    setAuthToken(null);
  }

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = await AsyncStorage.getItem('token');
      const tokenExpiration = await AsyncStorage.getItem('tokenExpiration');

      if (token && tokenExpiration) {
        const expirationTime = parseInt(tokenExpiration, 10);
        const currentTime = Date.now();

        if (expirationTime > currentTime) {
          setAuthToken(token);
          setLogoutTimer(expirationTime - currentTime);
        } else {
          await logout();
        }
      }
    };

    checkTokenValidity();
  }, []);

  const value = {
    token: authToken,
    isAuthenticated: !!authToken,
    authenticate: authenticate,
    logout: logout,
    resumeToken: resumeToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;
