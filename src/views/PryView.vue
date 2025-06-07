<!-- src/views/PryView.vue -->
<template>
  <div class="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
    <h1 class="text-6xl font-serif">PRY Page</h1>
    <p class="mt-4 text-gray-400">This is the page for the PRY card.</p>
    <router-link to="/pry" class="mt-8 px-4 py-2 bg-blue-500 rounded hover:bg-blue-600">
      Go Back
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'PryView'
}
</script>