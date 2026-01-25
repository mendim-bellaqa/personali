// src/main.js

import Vue from 'vue'
import App from './App.vue'
import router from './router' // <-- IMPORT THE ROUTER

Vue.config.productionTip = false

// Suppress ResizeObserver loop errors (these are benign in development)
const resizeObserverErrorHandler = (e) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.' ||
    e.message === 'ResizeObserver loop limit exceeded') {
    const resizeObserverErrDiv = document.getElementById('webpack-dev-server-client-overlay');
    if (resizeObserverErrDiv) {
      resizeObserverErrDiv.style.display = 'none';
    }
    e.stopImmediatePropagation();
    e.stopPropagation();
  }
}
window.addEventListener('error', resizeObserverErrorHandler);

new Vue({
  router, // <-- ADD THE ROUTER TO THE VUE INSTANCE
  render: h => h(App)
}).$mount('#app') 