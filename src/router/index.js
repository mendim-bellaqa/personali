import Vue from 'vue'
import VueRouter from 'vue-router'
import TskView from '../views/TskView.vue'
import HomeView from '../views/HomeView.vue' 
import PryView from '../views/PryView.vue'
import MedView from '../views/MedView.vue'
import DWNView from '../views/DWNView.vue'  // Good, uncommented and used

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: HomeView },       
  { path: '/tsk', name: 'Tsk', component: TskView },
  { path: '/pry', name: 'PG', component: PryView },
  { path: '/med', name: 'SC', component: MedView },
  { path: '/dwn', name: 'DWN', component: DWNView },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router