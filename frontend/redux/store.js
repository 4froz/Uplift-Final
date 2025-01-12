import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import userSlice from './UserSlice'; // Existing UserReducer
import tempUserReducer from './tempUserSlice'; // New tempUserReducer
import chatReducer from './chat'; // New tempUserReducer
import themeReducer from './themeSlice';


// Combine reducers first
const rootReducer = combineReducers({
  userInfo: userSlice,
  tempUser: tempUserReducer,
  chats: chatReducer,
  theme: themeReducer,
  // other reducers if any
});

// Apply persistence to the root reducer
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userInfo', 'theme'] // Only persist userInfo slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
});

// Persistor
const persistor = persistStore(store);

export { store, persistor };
