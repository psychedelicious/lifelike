import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import life from './life';
import drawing from './drawing';
import theme from './theme';
import performance from './performance';
import hud from './hud';
import menu from './menu';

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

const hudPersistConfig = {
  key: 'hud',
  storage: storage,
  whitelist: ['hudDisplayItems', 'opacity', 'shouldShowHUD'],
};

const performancePersistConfig = {
  key: 'performance',
  storage: storage,
  whitelist: ['speed', 'msDelay'],
};

const menuPersistConfig = {
  key: 'menu',
  storage: storage,
  whitelist: ['shouldShowTooltips'],
};

const drawingPersistConfig = {
  key: 'drawing',
  storage: storage,
  whitelist: [
    'brushShape',
    'brushRadius',
    'brushFill',
    'shouldDrawCrosshairs',
    'shouldShowGridlines',
  ],
};

export default combineReducers({
  life: persistReducer(lifePersistConfig, life),
  theme: persistReducer(themePersistConfig, theme),
  hud: persistReducer(hudPersistConfig, hud),
  performance: persistReducer(performancePersistConfig, performance),
  menu: persistReducer(menuPersistConfig, menu),
  drawing: persistReducer(drawingPersistConfig, drawing),
});
