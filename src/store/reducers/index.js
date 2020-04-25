import { combineReducers } from 'redux';
import life from './life';
import drawing from './drawing';
import theme from './theme';
import performance from './performance';

export default combineReducers({ life, drawing, theme, performance });
