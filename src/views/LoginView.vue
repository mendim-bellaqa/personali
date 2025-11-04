<template>
  <div class="min-h-screen flex items-center justify-center p-6">
    <div class="w-full max-w-md">
      <component :is="currentComponent" @login="onLogin" @switch="onSwitch" />
      <div class="mt-4 text-center text-sm text-gray-300">
        <router-link :to="{ name: 'Home' }" class="hover:underline">← Back to Home</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AuthLogin from '../components/auth/Login.vue'
import AuthRegister from '../components/auth/Register.vue'

export default {
  name: 'LoginView',
  components: { AuthLogin, AuthRegister },
  computed: {
    currentComponent() {
      return this.$route.query.mode === 'register' ? 'AuthRegister' : 'AuthLogin'
    }
  },
  methods: {
    onLogin(user) {
      console.log('User logged in:', user);
      const redirect = this.$route.query.redirect || '/'
      this.$router.replace(redirect).catch(err => {
        if (err.name !== 'NavigationDuplicated') {
          console.error('Navigation error:', err);
        }
      })
    },
    onSwitch() {
      const isRegister = this.$route.query.mode === 'register'
      this.$router.push({ name: 'Login', query: { ...this.$route.query, mode: isRegister ? undefined : 'register' } })
    }
  }
}
</script>

<style scoped>
</style>
