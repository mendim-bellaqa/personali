<template>
  <div class="relative min-h-screen bg-black overflow-hidden flex items-start justify-center p-4 text-white">
    <UniversalBanner />

    <main class="relative z-10 w-full max-w-3xl mx-auto mt-28">
      <div class="liquid-glass-card p-6">
        <h2 class="text-2xl font-bold mb-2">Preferences</h2>
        <p class="text-gray-300 mb-6">Configure your app preferences.</p>

        <div class="grid grid-cols-1 gap-4">
          <div class="flex items-center justify-between p-4 rounded-lg liquid-glass-card">
            <div>
              <h3 class="font-semibold">Enable desktop notifications</h3>
              <p class="text-sm text-gray-400">Allow the app to show notifications for reminders and updates.</p>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="preferences.notifications">
              <span class="slider"></span>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 rounded-lg liquid-glass-card">
            <div>
              <h3 class="font-semibold">Compact layout</h3>
              <p class="text-sm text-gray-400">Use a tighter layout for more tasks on screen.</p>
            </div>
            <label class="switch">
              <input type="checkbox" v-model="preferences.compact">
              <span class="slider"></span>
            </label>
          </div>

          <div class="flex items-center justify-between p-4 rounded-lg liquid-glass-card">
            <div>
              <h3 class="font-semibold">Items per page</h3>
              <p class="text-sm text-gray-400">How many tasks to show per page/list.</p>
            </div>
            <select v-model="preferences.itemsPerPage" class="form-select liquid-glass-input">
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex gap-3">
          <button @click="savePreferences" class="liquid-glass-button">Save Preferences</button>
          <button @click="revertPreferences" class="btn-secondary">Revert</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import UniversalBanner from '@/components/UniversalBanner.vue';
import { auth, db } from '@/services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default {
  name: 'SettingsView',
  components: { UniversalBanner },
  data() {
    return {
      preferences: {
        notifications: false,
        compact: false,
        itemsPerPage: '20'
      }
    };
  },
  async created() {
    if (!auth.currentUser) return this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
    try {
      const d = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (d.exists() && d.data().preferences) {
        this.preferences = { ...this.preferences, ...d.data().preferences };
      }
    } catch (err) {
      console.error('Failed to load preferences', err);
    }
  },
  methods: {
    async savePreferences() {
      if (!auth.currentUser) return;
      try {
        await setDoc(doc(db, 'users', auth.currentUser.uid), { preferences: this.preferences }, { merge: true });
        alert('Preferences saved');
      } catch (err) {
        console.error('Failed to save preferences', err);
        alert('Failed to save preferences.');
      }
    },
    async revertPreferences() {
      if (!auth.currentUser) return;
      try {
        const d = await getDoc(doc(db, 'users', auth.currentUser.uid));
        if (d.exists() && d.data().preferences) {
          this.preferences = { ...this.preferences, ...d.data().preferences };
        }
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}
.switch input { display:none; }
.slider {
  position: absolute;
  cursor: pointer;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(255,255,255,0.12);
  transition: .2s;
  border-radius: 999px;
}
.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .2s;
  border-radius: 50%;
}
input:checked + .slider { background-color: rgba(59,130,246,0.28); }
input:checked + .slider:before { transform: translateX(20px); }
</style>