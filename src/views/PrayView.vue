<template>
  <div class="page-content text-center max-w-2xl mx-auto bg-white p-6 sm:p-8 rounded-lg shadow-md">
    <h2 class="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Prayer Zone</h2>
    <p class="text-gray-600 mb-8 text-lg">
      This is the Prayer page. Content specific to prayer and reflection will appear here.
      You can add prayer guides, journals, or other features.
    </p>
    <router-link
      to="/"
      class="inline-block bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:shadow-md transition duration-150 ease-in-out"
    >
      Back to Home
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'PrayView',
};
</script>