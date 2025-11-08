<template>
  <div class="fixed inset-0 flex items-center justify-center p-4" role="dialog" aria-modal="true" style="z-index: 99999;">
    <div class="absolute inset-0 bg-black/60" @click="$emit('cancel')" style="z-index: 99990;"></div>
    <div class="relative bg-white/5 backdrop-blur-md rounded-lg max-w-md w-full p-4 text-white shadow-lg" style="z-index: 99999;">
      <h3 class="text-lg font-semibold mb-2">{{ title || 'Confirm' }}</h3>
      <p class="text-sm text-gray-200 mb-4">{{ message || 'Are you sure?' }}</p>
      <div class="flex justify-end gap-3">
        <button @click="$emit('cancel')" class="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600">Cancel</button>
        <button @click="$emit('confirm')" class="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    title: { type: String, default: 'Confirm' },
    message: { type: String, default: 'Are you sure?' }
  }
};
</script>

<style scoped>
/* small utility styles are handled by project utilities; keep modal simple */
</style>
