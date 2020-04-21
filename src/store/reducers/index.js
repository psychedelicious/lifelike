import { combineReducers } from 'redux';
import life from './life';
import drawing from './drawing';

export default combineReducers({ life, drawing });
