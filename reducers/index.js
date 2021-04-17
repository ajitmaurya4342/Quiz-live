import { combineReducers } from 'redux';
import countReducer from './countReducer.js';
import gamePoint from './gamePoint.js';

const allReducers = combineReducers({
    count: countReducer,
    gamePoint:gamePoint,

});
export default allReducers;