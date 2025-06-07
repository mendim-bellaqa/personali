// src/router/index.js

import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../App.vue' // We'll point the main path to our App component
import PryView from '../views/PryView.vue' // The new page we're creating

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: App // Your main carousel page is the home page
  },
  {
    path: '/pry',
    name: 'Pry',
    component: PryView // The page for the PRY card
  }
  // You can add more routes here for MED, TSK, etc.
]

const router = new VueRouter({
  mode: 'history', // Makes the URL clean (e.g., /pry instead of /#/pry)
  base: process.env.BASE_URL,
  routes
})

export default router