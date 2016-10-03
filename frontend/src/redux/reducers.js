import { combineReducers } from 'redux';

function ws(state = '', { type, ws }) {
  if (type === 'SET_WS') return ws;
  return state;
}

function data(state = {
  name: '',
  vkid: '',
  lottery: null,
  histories: [],
  navigation: '',
  prize: 0,
  turn: null,
  players: [],
  added_player: null,
  removed_player: null,
  root: {
    prizes: [],
  },
}, { type, ...data }) {
  if (type === 'SET_DATA') return { ...state, ...data };
  return state;
}


const mainReducer = combineReducers({
  ws,
  data,
});

export default mainReducer;
