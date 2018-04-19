import { combineReducers } from 'redux'
import locationReducer from './location'
import {LOAD_MESSAGES, LOAD_THREADS, LOGIN, LOGOUT, NEW_MESSAGE} from "./actionConstants";
import ActionTypes from "./ChatConstants";


function sessionReducer(state = {}, action) {
  if (action.type == LOGIN) {
    return Object.assign({}, action.payload);
  }
  if (action.type == LOGOUT) {
    return {};
  }
  return state;

}

function messagesReducer(state = {}, action) {
  if (action.type == LOAD_MESSAGES) {
    return Object.assign({}, state, action.payload);
  }
  if (action.type == NEW_MESSAGE) {
    return Object.assign({}, state, {[action.message.id]: action.message});

  }
  return state;
}

function threadReducer(state = {}, action) {
  if (action.type == LOAD_THREADS) {
    return Object.assign({}, state, action.payload);
  }
  if (action.type == NEW_MESSAGE) {
    var thread = state[action.message.threadId];
    thread.lastMessage = action.message.id;
  }
  return state;
}

function currentThreadIDReducer(state = {}, action) {
  if (action.type == ActionTypes.CLICK_THREAD) {
    return action.threadID;
  }
  return state;
}



export const makeRootReducer = () => {
  return combineReducers({
    location: locationReducer,
    session: sessionReducer,
    message: messagesReducer,
    thread: threadReducer,
    currentThreadID: currentThreadIDReducer,
  })
}

export const injectReducer = (store, { key, reducer }) => {
  if (Object.hasOwnProperty.call(store.asyncReducers, key)) return

  store.asyncReducers[key] = reducer
  store.replaceReducer(makeRootReducer(store.asyncReducers))
}

export default makeRootReducer
