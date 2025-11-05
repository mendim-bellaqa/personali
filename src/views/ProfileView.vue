<template>
  <div class="relative min-h-screen bg-black overflow-hidden flex items-center justify-center p-4 text-white">
    <UniversalBanner />

    <main class="relative z-10 w-full mx-auto h-screen flex items-center justify-center">
      <div class="liquid-glass-card p-8 profile-card">
        <h2 class="text-2xl font-bold mb-2 text-center">Profile Settings</h2>
        <p class="text-gray-300 mb-6 text-center">Edit your public profile information.</p>

        <div class="flex flex-col items-center gap-6">
          <div>
            <div class="avatar-large liquid-glass-card flex items-center justify-center">
              <span class="text-2xl font-bold">{{ userInitial }}</span>
            </div>
          </div>

          <div class="w-11/12 md:w-3/4">
            <div class="mb-4 text-center">
              <label class="block text-sm text-gray-300 mb-2 text-left">Display name</label>
              <input v-model="displayName" class="form-input liquid-glass-input w-full text-center" />
            </div>

            <div class="mb-4 text-center">
              <label class="block text-sm text-gray-300 mb-2 text-left">Email</label>
              <input :value="email" disabled class="form-input liquid-glass-input w-full opacity-70 text-center" />
            </div>

            <div class="mb-4 text-center">
              <label class="block text-sm text-gray-300 mb-2 text-left">Bio</label>
              <textarea v-model="bio" rows="3" class="form-input liquid-glass-input w-full resize-none text-center"></textarea>
            </div>

            <div class="flex justify-center items-center gap-4 mt-4">
              <button @click="saveProfile" class="liquid-glass-button">Save</button>
              <button @click="revert" class="btn-secondary">Revert</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import UniversalBanner from '@/components/UniversalBanner.vue';
import { auth, db } from '@/services/firebase';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default {
  name: 'ProfileView',
  components: { UniversalBanner },
  data() {
    return {
      displayName: '',
      email: '',
      bio: ''
    };
  },
  computed: {
    userInitial() {
      return (this.displayName || this.email || 'U').charAt(0).toUpperCase();
    }
  },
  async created() {
    const user = auth.currentUser;
    if (user) {
      this.displayName = user.displayName || '';
      this.email = user.email || '';
      // load bio from users collection if present
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          this.bio = data.bio || '';
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      }
    } else {
      // redirect to login
      this.$router.push({ name: 'Login', query: { redirect: this.$route.fullPath } });
    }
  },
  methods: {
    async saveProfile() {
      if (!auth.currentUser) return;
      try {
        // update Firebase Auth displayName
        await updateProfile(auth.currentUser, { displayName: this.displayName });
        // Save extra profile fields in Firestore users collection
        await setDoc(doc(db, 'users', auth.currentUser.uid), { bio: this.bio, displayName: this.displayName }, { merge: true });
        alert('Profile saved');
      } catch (err) {
        console.error('Failed to save profile:', err);
        alert('Failed to save profile. See console for details.');
      }
    },
    revert() {
      // reload from auth / firestore
      if (!auth.currentUser) return;
      this.displayName = auth.currentUser.displayName || '';
      this.email = auth.currentUser.email || '';
      getDoc(doc(db, 'users', auth.currentUser.uid)).then(d => {
        if (d.exists()) this.bio = d.data().bio || '';
      });
    }
  }
};
</script>

<style scoped>
.avatar-large {
  width: 96px;
  height: 96px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  background: linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
}

.liquid-glass-card { /* small override for profile */
  padding: 18px;
}

/* Profile specific styling */
.profile-card {
  width: 80%;
  max-width: 820px;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  background: linear-gradient(180deg, rgba(10,10,10,0.6), rgba(8,8,8,0.55));
  border: 1px solid rgba(255,255,255,0.06);
}

.liquid-glass-input {
  background: rgba(0,0,0,0.45) !important;
  border: 1px solid rgba(255,255,255,0.7) !important;
  color: white !important;
  padding: 12px 14px !important;
  border-radius: 12px !important;
  backdrop-filter: blur(8px);
}

.liquid-glass-input::placeholder { color: rgba(255,255,255,0.45); }

.profile-card .liquid-glass-button {
  padding: 10px 18px;
}

.btn-secondary { padding: 10px 16px; }
</style>