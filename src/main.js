// src/main.js

import Vue from 'vue'
import App from './App.vue'
import router from './router' // <-- IMPORT THE ROUTER

Vue.config.productionTip = false

new Vue({
  router, // <-- ADD THE ROUTER TO THE VUE INSTANCE
  render: h => h(App)
}).$mount('#app')