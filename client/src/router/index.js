import Vue from 'vue'
import Router from 'vue-router'

import MainForm from '../components/MainForm'
import LoginForm from '../components/LoginForm'
import store from '../data'
import { AUTHENTICATE } from '../data/mutationTypes'

Vue.use(Router)


export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'MainForm',
      component: MainForm,
      beforeEnter: (to, from, next) => {
        store.dispatch(AUTHENTICATE).then((authed) => {
          if (authed) {
            next()
          } else {
            next('/login')
          }
        })
      }
    },
    {
      path: '/login',
      name: 'LoginForm',
      component: LoginForm,
      beforeEnter: (to, from, next) => {
        store.dispatch(AUTHENTICATE).then((authed) => {
          if (authed) {
            next('/')
          } else {
            next()
          }
        })
      }
    },
    
    {
      path: '/:any',
      redirect: { name: 'MainForm' }
    }
  ]
})