<template>
  <header class="universal-banner">
    <div class="banner-container">
      <!-- PASS Logo/Button -->
      <router-link to="/" class="logo-section">
        <h1 class="banner-logo shine-animation">
          PASS
        </h1>
      </router-link>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <div class="nav-items">
          <router-link 
            v-for="item in navItems" 
            :key="item.path"
            :to="item.path"
            class="nav-item"
            :class="{ 'active': isActive(item.path) }"
            @click="handleNavClick"
          >
            <span class="nav-text">{{ item.name }}</span>
          </router-link>
        </div>
      </nav>

      <!-- Profile Section -->
      <div class="profile-section">
        <div class="profile-dropdown">
          <button @click="toggleProfileDropdown" class="profile-button">
            <div class="profile-avatar">
              <div class="avatar-circle">
                <span class="text-sm font-medium">{{ userInitial }}</span>
              </div>
            </div>
            <span class="profile-name hidden md:block">{{ userName || 'User' }}</span>
            <svg class="dropdown-arrow w-4 h-4" :class="{ 'rotate': showProfileDropdown }" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </button>
          
          <!-- Dropdown Menu -->
          <div v-if="showProfileDropdown" class="dropdown-menu liquid-glass">
            <router-link to="/profile" class="dropdown-item">Profile Settings</router-link>
            <router-link to="/settings" class="dropdown-item">Preferences</router-link>
            <button @click="signOut" class="dropdown-item text-red-400">Sign Out</button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { auth } from '../services/firebase';

export default {
  name: 'UniversalBanner',
  data() {
    return {
      showProfileDropdown: false,
      navItems: [
        { name: 'Collection', path: '/' },
        { name: 'Tasks', path: '/tsk' },
        { name: 'Projects', path: '/pry' },
        { name: 'Focus', path: '/med' },
        { name: 'Calendar', path: '/dwn' },
        { name: 'Archive', path: '/archive' }
      ]
    };
  },
  computed: {
    userName() {
      return auth.currentUser?.displayName || 'User';
    },
    userInitial() {
      return this.userName.charAt(0).toUpperCase();
    },
    currentPath() {
      return this.$route.path;
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    isActive(path) {
      if (path === '/') {
        return this.currentPath === '/';
      }
      return this.currentPath.startsWith(path);
    },
    
    toggleProfileDropdown() {
      this.showProfileDropdown = !this.showProfileDropdown;
    },

    handleClickOutside(event) {
      const dropdown = document.querySelector('.profile-dropdown');
      if (dropdown && !dropdown.contains(event.target)) {
        this.showProfileDropdown = false;
      }
    },

    handleNavClick() {
      this.showProfileDropdown = false;
    },

    async signOut() {
      try {
        await auth.signOut();
        this.$router.push('/login');
      } catch (error) {
        console.error('Error signing out:', error);
      }
    }
  }
};
</script>

<style scoped>
.universal-banner {
  position: fixed;
  top: 20px;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 0 20px;
  pointer-events: none;
}

.banner-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: none;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  padding: 12px 18px;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  box-shadow:
    0 6px 30px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.03);
  pointer-events: auto;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Keep banner background subtle and don't change on hover */
.banner-container {
  background: rgba(255, 255, 255, 0.03);
}

/* Logo Section */
.logo-section {
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo-section:hover {
  transform: scale(1.05);
}

.banner-logo {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.8) 50%, transparent 100%);
  background-size: 200% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: shine 3s ease-in-out infinite;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

/* Navigation Menu */
.nav-menu {
  flex: 1;
  display: flex;
  justify-content: center;
}

.nav-items {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
}

.nav-item:hover {
  color: white;
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-item.active {
  color: white;
  background: rgba(59, 130, 246, 0.2);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.nav-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 2px;
}

/* Profile Section */
.profile-section {
  position: relative;
}

.profile-dropdown {
  position: relative;
}

.profile-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  color: white;
  cursor: pointer;
}

.profile-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.profile-avatar {
  display: flex;
  align-items: center;
}

.avatar-circle {
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 12px;
}

.profile-name {
  font-weight: 500;
  font-size: 14px;
}

.dropdown-arrow {
  transition: transform 0.3s ease;
}

.dropdown-arrow.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  min-width: 180px;
  border-radius: 16px;
  padding: 8px 0;
  z-index: 50;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.dropdown-item {
  display: block;
  width: 100%;
  padding: 10px 14px;
  color: white;
  text-decoration: none;
  transition: background-color 0.2s ease;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* Add smoother swipe animation for cards */
.swipe-card {
  transition: transform 0.5s ease-in-out, opacity 0.5s ease-in-out;
}
.swipe-card:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

/* Animations */
@keyframes shine {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .universal-banner {
    top: 16px;
    padding: 0 12px;
  }
  
  .banner-container {
    padding: 12px 16px;
    gap: 16px;
    min-width: 280px;
    max-width: 700px;
  }
  
  .nav-items {
    gap: 6px;
  }
  
  .nav-item {
    padding: 6px 12px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .universal-banner {
    top: 12px;
    padding: 0 8px;
  }
  
  .banner-container {
    padding: 10px 12px;
    gap: 12px;
    min-width: 260px;
    max-width: 600px;
    border-radius: 16px;
  }
  
  .banner-logo {
    font-size: 20px;
  }
  
  .nav-items {
    gap: 4px;
    flex-wrap: wrap;
  }
  
  .nav-item {
    padding: 5px 10px;
    font-size: 12px;
  }
  
  .profile-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .universal-banner {
    top: 8px;
    padding: 0 6px;
  }
  
  .banner-container {
    padding: 8px 10px;
    gap: 10px;
    min-width: 240px;
    max-width: 500px;
    border-radius: 14px;
  }
  
  .banner-logo {
    font-size: 18px;
  }
  
  .nav-menu {
    display: none; /* Hide nav items on very small screens */
  }
}

/* Hide banner on auth pages */
.auth-page .universal-banner {
  display: none;
}
</style>