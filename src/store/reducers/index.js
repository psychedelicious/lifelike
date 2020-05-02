import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import life from './life';
import drawing from './drawing';
import theme from './theme';
import performance from './performance';

const lifePersistConfig = {
  key: 'life',
  storage: storage,
  whitelist: ['bookmarks'],
};

const themePersistConfig = {
  key: 'theme',
  storage: storage,
  whitelist: ['themeColor', 'colorMode', 'shouldSwapCellColors'],
};

export default combineReducers({
  life: persistReducer(lifePersistConfig, life),
  theme: persistReducer(themePersistConfig, theme),
  drawing,
  performance,
});
