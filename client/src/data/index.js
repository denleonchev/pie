import Vue from 'vue'
import axios from 'axios'

import Vuex from 'vuex'
Vue.use(Vuex)

import { LOGIN, LOGOUT, UPLOAD, AUTHENTICATE } from './mutationTypes'

export default new Vuex.Store({
  state: {
    anonymousUser: true,
    /* isUserFetching: false, */
    path: ''
  },
  mutations: {
    [LOGIN] (state, payload) {
      state.anonymousUser = payload instanceof Error ? payload : !payload
    },
    [UPLOAD] (state, payload) {
      state.path = payload
    }
  },
  actions: {
    [LOGIN] (store, payload) {
      return axios.post('/api/login', payload)
      .then((res) => {
        store.commit(LOGIN, res.data.authed)
      }, (err) => {
        store.commit(LOGIN, err)
      })
    },
    [LOGOUT] (store, payload) {
      return axios.post('/api/logout', payload)
      .then((res) => {
        store.commit(LOGIN, res.data.authed)
      }, (err) => {
        store.commit(LOGIN, err)
      })
    },
    [UPLOAD] (store, payload) {
      return axios.post('/api/upload', payload, { headers: {'Content-Type': 'multipart/form-data'} })
        .then((res) => {
          store.commit(UPLOAD, res.data.path)
        }, (err) => {
          store.commit(UPLOAD, err)
        })
    },
    [AUTHENTICATE] (store, payload) {
      return axios.get('/api/auth')
      .then((res) => {
        store.commit(LOGIN, res.data.authed)
        return res.data.authed
      }, (err) => {
        store.commit(LOGIN, err)
      })
    }
  }
})