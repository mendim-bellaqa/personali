<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <auth-register />
      <div class="mt-4 text-center text-sm text-gray-300">
        <router-link :to="{ name: 'Login', query: $route.query }" class="text-green-400 hover:text-green-300">Already have an account? Sign in</router-link>
        <div class="mt-2">
          <router-link to="/" class="hover:underline">← Back to Home</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AuthRegister from '../components/auth/Register.vue'

export default {
  name: 'RegisterView',
  components: { AuthRegister }
}
</script>

<style scoped>
</style>
