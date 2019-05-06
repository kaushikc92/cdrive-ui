import { handleActions } from 'redux-actions';
import {
  GET_USER_DETAILS_INIT, GET_USER_DETAILS_DONE, GET_USER_DETAILS_FAIL
} from './actions'
import _ from 'underscore'

const initialState = {
  userDetails: {},
  fetching: false,
}

const app = handleActions({
  GET_USER_DETAILS_INIT: (state, action) => {
  	let newState = JSON.parse(JSON.stringify(state))
  	newState.fetching = true
  	return newState
  },
  
  GET_USER_DETAILS_DONE: (state, action) => {
    let newState = JSON.parse(JSON.stringify(state))
    newState.userDetails = action.payload.data
    newState.fetching = false
    return newState
  },

  GET_USER_DETAILS_FAIL: (state, action) => {
  	let newState = JSON.parse(JSON.stringify(state))
  	newState.fetching = false
  	return newState
  },
}, initialState);

export default app
