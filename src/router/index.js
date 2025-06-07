// src/router/index.js

import Vue from 'vue'
import VueRouter from 'vue-router'
// --- We still need to import all the views ---
import App from '../App.vue' // Your carousel is in App.vue
import PryView from '../views/PryView.vue'
import MedView from '../views/MedView.vue'
import TskView from '../views/TskView.vue'

Vue.use(VueRouter)

// --- THIS IS THE CORRECT, SIMPLE ROUTE LIST ---
const routes = [
  {
    path: '/',
    name: 'Home',
    component: App // The home path '/' loads App.vue (the carousel).
  },
  {
    path: '/pry',
    name: 'Pry',
    component: PryView
  },
  {
    path: '/med',
    name: 'Med',
    component: MedView
  },
  {
    path: '/tsk',
    name: 'Tsk',
    component: TskView
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router