import { clamp } from 'lodash';
import { speedToMs } from 'store/reducers/performance/utilities';

const DECREMENT_SPEED = 'DECREMENT_SPEED';
const INCREMENT_SPEED = 'INCREMENT_SPEED';
const SET_FPS = 'SET_FPS';
const SET_PREVIOUS_FRAMETIME = 'SET_PREVIOUS_FRAMETIME';
const SET_SPEED = 'SET_SPEED';

const initialState = {
  speed: 70,
  msDelay: speedToMs(70),
  fps: 0,
  previousFrameTime: 0,
  minSpeed: 0,
  maxSpeed: 100,
};

export default function life(state = initialState, action) {
  switch (action.type) {
    case SET_FPS:
      return {
        ...state,
        fps: action.fps,
      };
    case SET_SPEED: {
      return {
        ...state,
        speed: action.speed,
        msDelay: speedToMs(action.speed),
      };
    }
    case INCREMENT_SPEED: {
      const newSpeed = clamp(state.speed + 5, state.minSpeed, state.maxSpeed);

      return {
        ...state,
        speed: newSpeed,
        msDelay: speedToMs(newSpeed),
      };
    }
    case DECREMENT_SPEED: {
      const newSpeed = clamp(state.speed - 5, state.minSpeed, state.maxSpeed);
      return {
        ...state,
        speed: newSpeed,
        msDelay: speedToMs(newSpeed),
      };
    }
    case SET_PREVIOUS_FRAMETIME: {
      return {
        ...state,
        previousFrameTime: action.previousFrameTime,
      };
    }
    default:
      return state;
  }
}

export const setSpeed = ({ speed }) => ({ type: SET_SPEED, speed });

export const incrementSpeed = () => ({
  type: INCREMENT_SPEED,
});

export const decrementSpeed = () => ({
  type: DECREMENT_SPEED,
});

export const setPreviousFrameTime = (previousFrameTime) => ({
  type: SET_PREVIOUS_FRAMETIME,
  previousFrameTime,
});

export const setFps = (fps) => ({
  type: SET_FPS,
  fps,
});
