import { createAction } from 'redux-actions';
import axios from 'axios'
import Cookies from 'universal-cookie';

import { authUrl, cdriveUrl } from 'containers/App/baseUrl';


export function authenticateUser() {
    return(dispatch, getState) => {
        const cookies = new Cookies();
        var columbus_token = cookies.get('columbus_token')
        if (columbus_token != undefined) {
            return true;
        }

        var url_string = window.location.href;
        var url = new URL(url_string);
        var code = url.searchParams.get("code");

        if (code == null) {
            const request = axios({
                method: 'GET',
                url: `${cdriveUrl}client-id/`
            });
            request.then(
                response => {
                    var client_id = response.data.client_id;
                    var uri = `http://` + window.location.hostname;
                    window.location.href = `${authUrl}o/authorize/?response_type=code&client_id=${client_id}&redirect_uri=${uri}&state=1234xyz`;
                },
            );
            return false;
        } else {
            const request = axios({
                method: 'POST',
                url: `${cdriveUrl}authentication-token/`,
                data: {
                    code: code,
                    redirect_uri: `http://` + window.location.hostname
                }
            });
            request.then(
                response => {
                    cookies.set('columbus_token', response.data.access_token);
                }
            );
            return true;
        }
    }
}

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
    var auth_header = 'Bearer ' + cookies.get('columbus_token'); 
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
