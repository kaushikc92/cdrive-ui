import { createAction } from 'redux-actions';
import axios from 'axios'
import Cookies from 'universal-cookie';
import { authUrl, cdriveUrl } from 'containers/App/baseUrl';

export const CHANGE_MODULE = 'CHANGE_MODULE'
export function changeModule(module) {
  return {
    type: CHANGE_MODULE,
    module
  }
}

export const SELECT_FILE_DONE = 'SELECT_FILE_DONE'
const selectFileDone = createAction('SELECT_FILE_DONE');
export function selectFile(fileName) {
  return (dispatch, getState) => {
    dispatch(selectFileDone(fileName))
  }
}

export const UPLOAD_CSV_INIT = 'UPLOAD_CSV_INIT'
const uploadCSVInit = createAction('UPLOAD_CSV_INIT');
export const UPLOAD_CSV_DONE = 'UPLOAD_CSV_DONE'
const uploadCSVDone = createAction('UPLOAD_CSV_DONE');
export const UPLOAD_CSV_FAIL = 'UPLOAD_CSV_FAIL'
const uploadCSVFail = createAction('UPLOAD_CSV_FAIL');

export function uploadCsv(data) {
	return (dispatch, getState) => {
		dispatch(uploadCSVInit())
        const cookies = new Cookies();
        var auth_header = 'Basic ' + cookies.get('cdrive_token'); 
		const request = axios({
            method: 'POST',
            url: `${cdriveUrl}upload/`,
            data: data,
            headers: {'Authorization': auth_header}
    });
    
    return request.then(
      response => {
        dispatch(uploadCSVDone(response))
      },
      err => dispatch(uploadCSVFail(err))
    );
	}
}

export const GET_FILES_DONE = 'GET_FILES_DONE'
const getFilesDone = createAction('GET_FILES_DONE');
export const GET_FILES_FAIL = 'GET_FILES_FAIL'
const getFilesFail = createAction('GET_FILES_FAIL');
export function getFiles() {
	return(dispatch, getState) => {
    const cookies = new Cookies();
    var auth_header = 'Basic ' + cookies.get('cdrive_token'); 
    const request = axios({
        method: 'GET',
        url: `${cdriveUrl}list/`,
        headers: {'Authorization': auth_header}
    });

    return request.then(
        response => {
            dispatch(getFilesDone(response))
        },
        err => dispatch(getFilesFail(err))
    );
	}
}

export const GET_SHARED_FILES_DONE = 'GET_SHARED_FILES_DONE'
const getSharedFilesDone = createAction('GET_SHARED_FILES_DONE');
export const GET_SHARED_FILES_FAIL = 'GET_SHARED_FILES_FAIL'
const getSharedFilesFail = createAction('GET_SHARED_FILES_FAIL');
export function getSharedFiles() {
  return(dispatch, getState) => {
    const cookies = new Cookies();
    var auth_header = 'Basic ' + cookies.get('cdrive_token'); 
    const request = axios({
        method: 'GET',
        url: `${cdriveUrl}shared-files-list/`,
        headers: {'Authorization': auth_header}
    });

    return request.then(
        response => {
            dispatch(getSharedFilesDone(response))
        },
        err => dispatch(getSharedFilesFail(err))
    );
  }
}

export const SHARE_FILE_INIT = 'SHARE_FILE_INIT'
const shareFileInit = createAction('SHARE_FILE_INIT');
export const SHARE_FILE_DONE = 'SHARE_FILE_DONE'
const shareFileDone = createAction('SHARE_FILE_DONE');
export function shareFileWithOthers(data) {
  return(dispatch, getState) => {
    const cookies = new Cookies();
    var auth_header = 'Basic ' + cookies.get('cdrive_token'); 
    dispatch(shareFileInit())
    const request = axios({
        method: 'POST',
        url: `${cdriveUrl}share-file/`,
        data: data,
        headers: {'Authorization': auth_header}
    });

    return request.then(
        response => {
            dispatch(shareFileDone(response))
        },
        err => dispatch(getFilesFail(err))
    );
  }
}

export const GET_SERVICES_DONE = 'GET_SERVICES_DONE'
const getServicesDone = createAction('GET_SERVICES_DONE');
export const GET_SERVICES_FAIL = 'GET_SERVICES_FAIL'
const getServicesFail = createAction('GET_SERVICES_FAIL');
export function getServices() {
  return(dispatch, getState) => {
    const cookies = new Cookies();
    var auth_header = 'Basic ' + cookies.get('cdrive_token'); 
    const request = axios({
        method: 'GET',
        url: `${cdriveUrl}admin-api/services/`,
        headers: {'Authorization': auth_header}
    });

    return request.then(
        response => {
            dispatch(getServicesDone(response))
        },
        err => dispatch(getServicesDone(err))
    );
  }
}

export const DELETE_FILE_DONE = 'DELETE_FILE_DONE'
const deleteFileDone = createAction('DELETE_FILE_DONE');
export const DELETE_FILE_FAIL = 'DELETE_FILE_FAIL'
const deleteFileFail = createAction('DELETE_FILE_FAIL');
export function deleteFile(fileName) {
	return(dispatch, getState) => {
    const cookies = new Cookies();
    let auth_header = 'Basic ' + cookies.get('cdrive_token');
		const request = axios({
      method: 'DELETE',
      url: `${cdriveUrl}delete/?file_name=${fileName}`,
      headers: {'Authorization': auth_header}
    });
    
    return request.then(
      response => dispatch(getFiles()),
      err => dispatch(deleteFileFail(err))
    );
	}
}

export const DOWNLOAD_FILE_DONE = 'DOWNLOAD_FILE_DONE'
const downloadFileDone = createAction('DOWNLOAD_FILE_DONE');
export const DOWNLOADFILE_FAIL = 'DOWNLOADFILE_FAIL'
const downloadFileFail = createAction('DOWNLOADFILE_FAIL');
export function downloadFile(fileName) {
  return(dispatch, getState) => {
    const cookies = new Cookies();
    let auth_header = 'Basic ' + cookies.get('cdrive_token');
    const request = axios({
      method: 'GET',
      url: `${cdriveUrl}download/?file_name=${fileName}`,
      headers: {'Authorization': auth_header}
    });
    
    return request.then(
      response => {
        const link = document.createElement('a');
        link.href = response.data.download_url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
      err => dispatch(downloadFileFail(err))
    );
  }
}


export function downloadSharedFile(file_name, file_owner) {
  return(dispatch, getState) => {
    const cookies = new Cookies();
    let auth_header = 'Basic ' + cookies.get('cdrive_token');
    const request = axios({
      method: 'GET',
      url: `${cdriveUrl}download-shared-file/?file_name=${file_name}&file_owner=${file_owner}`,
      headers: {'Authorization': auth_header}
    });
    
    return request.then(
      response => {
        const link = document.createElement('a');
        link.href = response.data.download_url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      },
    );
  }
}

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
                    var uri = `http://0.0.0.0:3000`;
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
                    redirect_uri: `http://0.0.0.0:3000`
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
