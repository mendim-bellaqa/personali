import Vue from 'vue'
import VueRouter from 'vue-router'
import TskView from '../views/TskView.vue'
import HomeView from '../views/HomeView.vue' 
import PryView from '../views/PryView.vue'
import MedView from '../views/MedView.vue'

import C14View from '../views/C14View.vue'
import CRSNView from '../views/CRSNView.vue'
import DWNView from '../views/DWNView.vue'  // <-- uncommented

Vue.use(VueRouter)

const routes = [
  { path: '/tsk', name: 'Tsk', component: TskView },
  { path: '/', name: 'Home', component: HomeView },
  { path: '/pry', name: 'Pry', component: PryView },
  { path: '/med', name: 'Med', component: MedView },
  { path: '/c14', name: 'C14', component: C14View },
  { path: '/crsn', name: 'CRSN', component: CRSNView },  // cleaned URL
  { path: '/dwn', name: 'DWN', component: DWNView },    // cleaned URL
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
