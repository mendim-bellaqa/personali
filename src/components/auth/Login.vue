<template>
  <div class="max-w-md mx-auto bg-white/5 p-6 rounded-lg shadow-lg backdrop-blur">
    <h2 class="text-2xl font-bold mb-4 text-white">Welcome back</h2>
    
    <form @submit.prevent="login" class="space-y-4">
      <div>
        <label class="block text-sm text-gray-300">Email or username</label>
        <input 
          v-model="identifier" 
          type="text"
          required
          class="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
          placeholder="email@example.com or username"
        />
      </div>

      <div>
        <label class="block text-sm text-gray-300">Password</label>
        <input 
          v-model="password" 
          type="password"
          required
          class="w-full p-3 rounded-lg bg-black/20 text-white border border-white/20 focus:border-blue-400 focus:outline-none transition-colors"
          placeholder="Your password"
        />
      </div>

      <button 
        type="submit" 
        :disabled="loading"
        class="w-full px-4 py-3 liquid-glass rounded-lg font-medium disabled:opacity-50"
      >
        <span v-if="loading">Signing in...</span>
        <span v-else>Sign in</span>
      </button>
    </form>

    <!-- Divider -->
    <div class="my-6 flex items-center">
      <div class="flex-1 border-t border-white/20"></div>
      <span class="px-4 text-sm text-gray-400">or</span>
      <div class="flex-1 border-t border-white/20"></div>
    </div>

    <!-- Google Sign In -->
    <button 
      @click="loginWithGoogle"
      :disabled="loading"
      class="w-full px-4 py-3 liquid-glass rounded-lg font-medium disabled:opacity-50"
    >
      Sign in with Google
    </button>

    <div class="mt-6 text-center">
      <p class="text-sm text-gray-300">
        Don't have an account?
        <router-link to="/register" class="text-blue-400 hover:text-blue-300 transition-colors">
          Sign up
        </router-link>
      </p>
    </div>

    <!-- Registration Success Message -->
    <div v-if="$route.query.registered" class="mt-4 p-3 bg-green-500/20 text-green-300 rounded-lg text-sm">
      🎉 Account created successfully! Please sign in with your credentials.
    </div>

    <!-- Error Messages -->
    <div v-if="message" :class="['mt-4 p-3 rounded-lg text-sm', messageType === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300']">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../../services/firebase';
import { collection, query, where, getDocs, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default {
  name: 'AuthLogin',
  data() {
    return {
      identifier: '', // email or username
      password: '',
      loading: false,
      message: '',
      messageType: 'info'
    };
  },
  methods: {
    async login() {
      // Basic validation
      if (!this.identifier || !this.password) {
        this.showMessage('Please enter both email/username and password', 'error');
        return;
      }

      this.loading = true;
      this.message = '';

      // detect email vs username
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      let emailToUse = null;

      try {
        if (emailRegex.test(this.identifier.trim())) {
          // user entered an email
          emailToUse = this.identifier.trim();
        } else {
          // treat as username — lookup in users collection
          const q = query(collection(db, 'users'), where('displayName', '==', this.identifier.trim()));
          const snap = await getDocs(q);
          if (snap.empty) {
            this.showMessage('Username not found. Please create an account.', 'error');
            this.loading = false;
            return;
          }
          // pick first matching user (if duplicates exist)
          const userDoc = snap.docs[0];
          const data = userDoc.data();
          if (!data.email) {
            this.showMessage('User record has no email. Please contact support.', 'error');
            this.loading = false;
            return;
          }
          emailToUse = data.email;
        }

        console.log('Attempting to sign in with email:', emailToUse);
        const userCredential = await signInWithEmailAndPassword(auth, emailToUse, this.password);
        console.log('Login successful:', userCredential.user.uid);

        // Ensure a users/{uid} doc exists (useful if accounts were created before client-side writes were added)
        try {
          const uref = doc(db, 'users', userCredential.user.uid);
          const ud = await getDoc(uref);
          if (!ud.exists()) {
            await setDoc(uref, {
              uid: userCredential.user.uid,
              email: userCredential.user.email,
              displayName: userCredential.user.displayName || '',
              provider: 'password',
              createdAt: serverTimestamp(),
              emailVerified: userCredential.user.emailVerified || false
            }, { merge: true });
            console.log('Created users/{uid} document for', userCredential.user.uid);
          }
        } catch (e) {
          console.warn('Failed to ensure users doc exists:', e);
        }

        this.showMessage('Successfully signed in!', 'success');
        // Wait a moment then emit login event
        setTimeout(() => {
          this.$emit('login', userCredential.user);
        }, 800);

      } catch (error) {
        console.error('Login error:', error);
        let errorMessage = 'Login failed';
        // If the error is from Firebase Auth, map known codes
        if (error && error.code) {
          switch (error.code) {
            case 'auth/user-not-found':
              errorMessage = 'No account found with this email. Please check the email or sign up.';
              break;
            case 'auth/wrong-password':
              errorMessage = 'Incorrect password. Please try again.';
              break;
            case 'auth/email-not-verified':
              errorMessage = 'Please verify your email address before signing in.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Too many failed attempts. Please try again later.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Invalid email address.';
              break;
            case 'auth/user-disabled':
              errorMessage = 'This account has been disabled.';
              break;
            default:
              errorMessage = error.message || String(error);
          }
        } else {
          errorMessage = error.message || String(error);
        }

        this.showMessage(errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    },

    async loginWithGoogle() {
      try {
        this.loading = true;
        this.message = '';

        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        console.log('Google login successful:', result.user.uid);

        // Ensure users/{uid} exists for Google sign-ins too
        try {
          const uref = doc(db, 'users', result.user.uid);
          const ud = await getDoc(uref);
          if (!ud.exists()) {
            await setDoc(uref, {
              uid: result.user.uid,
              email: result.user.email,
              displayName: result.user.displayName || '',
              provider: 'google',
              createdAt: serverTimestamp(),
              emailVerified: result.user.emailVerified || false
            }, { merge: true });
            console.log('Created users/{uid} document for Google user', result.user.uid);
          }
        } catch (e) {
          console.warn('Failed to ensure users doc exists for Google user:', e);
        }

        this.showMessage('Successfully signed in with Google!', 'success');
        
        // Wait a moment then emit login event
        setTimeout(() => {
          this.$emit('login', result.user);
        }, 1000);

      } catch (error) {
        console.error('Google login error:', error);
        
        let errorMessage = 'Google login failed';
        if (error.code === 'auth/popup-closed-by-user') {
          errorMessage = 'Login cancelled. Please try again.';
        }
        
        this.showMessage(errorMessage, 'error');
      } finally {
        this.loading = false;
      }
    },

    showMessage(text, type) {
      this.message = text;
      this.messageType = type;
      
      // Clear message after 10 seconds
      setTimeout(() => {
        this.message = '';
      }, 10000);
    }
  }
};
</script>

<style scoped>
.liquid-glass {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  color: white;
  transition: all 0.3s ease;
  cursor: pointer;
}

.liquid-glass:hover {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.4);
  transform: translateY(-2px);
}

.liquid-glass:disabled {
  cursor: not-allowed;
  transform: none;
}

input:focus {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>
