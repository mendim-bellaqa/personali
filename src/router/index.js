// src/router/index.js

import Vue from 'vue'
import VueRouter from 'vue-router'

// --- CORRECTED IMPORTS ---
// 1. We import HomeView for the homepage. You will need to create this file.
import HomeView from '../views/HomeView.vue' 

// 2. We import all the views that you have created.
import PryView from '../views/PryView.vue'
import MedView from '../views/MedView.vue'
import TskView from '../views/TskView.vue'
import C14View from '../views/C14View.vue'
import CRSNView from '../views/CRSNView.vue' // You confirmed this exists, so we import it.

// 3. We comment out DWNView because the file does not exist yet.
// import DWNView from '../views/DWNView.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    // 4. The homepage correctly loads the HomeView component, NOT App.vue
    component: HomeView 
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
  },
  {
    // 5. Using a clean, standard URL path for C14
    path: '/c14', 
    name: 'C14',
    component: C14View
  },
  {
    path: '/cr-sn',
    name: 'CRSN',
    component: CRSNView
  },
  //  This route is commented out until you create the DWNView.vue file
  // {
  //   path: '/dw-n',
  //   name: 'DWN',
  //   component: DWNView
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router