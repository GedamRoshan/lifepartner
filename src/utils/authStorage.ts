import AsyncStorage from '@react-native-async-storage/async-storage';

export const AUTH_USER_STORAGE_KEY = 'lifepartner.authUser';

export const saveAuthUser = async (user: unknown) => {
  await AsyncStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
};

export const getAuthUser = async () => {
  const value = await AsyncStorage.getItem(AUTH_USER_STORAGE_KEY);
  return value ? JSON.parse(value) : null;
};

export const clearAuthUser = async () => {
  await AsyncStorage.removeItem(AUTH_USER_STORAGE_KEY);
};
