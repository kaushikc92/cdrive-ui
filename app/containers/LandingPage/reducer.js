import { handleActions } from 'redux-actions';
import {
  CHANGE_MODULE,
  UPLOAD_CSV_INIT,
  UPLOAD_CSV_DONE,
  UPLOAD_CSV_FAIL,
  GET_FILES_DONE,
  GET_FILES_FAIL,
  DELETE_FILE_DONE,
  DOWNLOAD_FILE_DONE,
  DOWNLOAD_FILE_FAIL,
  GET_SERVICES_DONE,
  GET_SERVICES_FAIL,
  SELECT_FILE_DONE,
  GET_SHARED_FILES_DONE,
  SHARE_FILE_DONE
} from './actions'
import _ from 'underscore'

const initialState = {
  module: "drive",
  uploading: false,
  files: [],
  dowloadLinks: {},
  services: {},
  selectedFiles: [],
  sharedFiles: [],
}

const landingPage = handleActions(
  {
    CHANGE_MODULE: (state, action) => {
      return Object.assign({}, state, { module: action.module });
    },

    UPLOAD_CSV_INIT: (state, action) => {
      return Object.assign({}, state, { uploading: true });
    },

    SELECT_FILE_DONE: (state, action) => {
      let newState = JSON.parse(JSON.stringify(state))
      let index = newState.selectedFiles.indexOf(action.payload)
      if( index == -1) {
        newState.selectedFiles = []
        newState.selectedFiles.push(action.payload)
      } else {
        newState.selectedFiles.splice(index, index + 1) 
      }
      newState.selectedFiles = _.uniq(newState.selectedFiles)
      return newState
    },

    UPLOAD_CSV_DONE: (state, action) => {
      // let newState = Object.assign({}, state, true)
      let newState = JSON.parse(JSON.stringify(state))
      let files = newState.files
      files.push(action.payload.data)
      newState.files = files;
      newState.uploading = false
      return newState
    },

    UPLOAD_CSV_FAIL: (state, action) => {
      return Object.assign({}, state, { uploading: false });
    },

    GET_FILES_DONE: (state, action) => {
      return Object.assign({}, state, { files: action.payload.data });
    },

    GET_SHARED_FILES_DONE: (state, action) => {
      return Object.assign({}, state, { sharedFiles: action.payload.data });
    }, 

    DELETE_FILE_DONE: (state, action) => {
      let newState = Object.assign({}, state, true)
      let files = newState.files
      let newFiles = []
      _.map(files, (file, i) => {
        if(file.id != action.payload) {
          newFiles.push(file)
        }
      })
      newState.files = newFiles;
      return newState
    },

    DOWNLOAD_FILE_DONE: (state, action) => {
      let newState = JSON.parse(JSON.stringify(state))
      const { fileName, link } = action.payload
      newState.dowloadLinks[fileName] = link
      return newState
    },

    GET_SERVICES_DONE: (state, action) => {
      let newState = JSON.parse(JSON.stringify(state))
      newState.services = JSON.parse(action.payload.data.services)
      return newState
    },
    SHARE_FILE_DONE: (state, action) => {
      let newState = JSON.parse(JSON.stringify(state))
      newState.selectedFiles = []
      return newState
    }
  }, initialState);

export default landingPage
