<template>
  <div class="page-content text-center max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
    <h2 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Meditation Space</h2>
    <p class="text-gray-600 mb-8 text-lg">
      Welcome to your Meditation Space. Find guided meditations, timers, and calming sounds here.
    </p>
    <router-link
      to="/"
      class="inline-block bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition duration-150 ease-in-out"
    >
      Back to Home
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'MeditateView',
};
</script>