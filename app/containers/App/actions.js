import { createAction } from 'redux-actions';
import axios from 'axios'
import Cookies from 'universal-cookie';
//import { baseUrl } from 'containers/App/baseUrl';

//const cdriveUrl = `${baseUrl}cdrive/`;

/*
export const GET_USER_DETAILS_INIT = 'GET_USER_DETAILS_INIT'
const userDetailsInit = createAction('GET_USER_DETAILS_INIT');
export const GET_USER_DETAILS_DONE = 'GET_USER_DETAILS_DONE'
const userDetailsDone = createAction('GET_USER_DETAILS_DONE');
export const GET_USER_DETAILS_FAIL = 'GET_USER_DETAILS_FAIL'
const userDetailsFail = createAction('GET_USER_DETAILS_FAIL');
export function userDetails() {
  return(dispatch, getState) => {
    dispatch(userDetailsInit())
    const cookies = new Cookies();
    var auth_header = 'Basic ' + cookies.get('cdrive_token'); 
    const request = axios({
        method: 'GET',
        url: `${cdriveUrl}user-details/`,
        headers: {'Authorization': auth_header}
    });

    return request.then(
        response => {
            dispatch(userDetailsDone(response))
        },
        err => {
        }
    );
  }
}
*/
