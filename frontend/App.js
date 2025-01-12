import * as React from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {persistor, store} from './redux/store';
import {MainNav} from './2.0/navigations/MainNav';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { LogBox } from 'react-native';

const App = () => {

  const MyTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'black',
    },
  };
  
  LogBox.ignoreAllLogs();

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
      <NavigationContainer theme={MyTheme}>
        <MainNav />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
