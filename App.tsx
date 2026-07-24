import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import BootSplash from 'react-native-bootsplash';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider, useDispatch } from 'react-redux';
import { store } from './src/store';
import { RootNavigator } from './src/navigation/RootNavigator';
import { loginSuccess, restoreComplete } from './src/store/slices/authSlice';
import { getAuthUser } from './src/utils/authStorage';

const AppContent = () => {
  const dispatch = useDispatch();
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const user = await getAuthUser();

        if (user) {
          dispatch(loginSuccess(user));
        }
      } finally {
        dispatch(restoreComplete());
        setIsRestoring(false);
        BootSplash.hide({ fade: true }).catch(() => {});
      }
    };

    restoreAuth();
  }, [dispatch]);

  if (isRestoring) {
    return null;
  }

  return <RootNavigator />;
};

const App = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <AppContent />
      </GestureHandlerRootView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
